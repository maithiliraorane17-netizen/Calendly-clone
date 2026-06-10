const { body }         = require("express-validator");
const Booking          = require("../models/Booking");
const EventType        = require("../models/EventType");
const User             = require("../models/User");
const { asyncHandler } = require("../middleware/errorHandler");
const { sendEmail, emailTemplates } = require("../utils/email");
const { getAvailableSlots, isSlotAvailable } = require("../utils/availability");

// ─── Validation ──────────────────────────────────────────────────────────────
exports.createBookingRules = [
  body("eventTypeId").notEmpty().withMessage("Event type ID required"),
  body("scheduledAt").isISO8601().withMessage("Valid date/time required"),
  body("invitee.name").trim().notEmpty().withMessage("Your name is required"),
  body("invitee.email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("timezone").optional().trim(),
];

// ─── @route  GET  /api/bookings/availability ─────────────────────────────────
// GET /api/bookings/availability?eventTypeId=xxx&date=2025-06-15
exports.getAvailability = asyncHandler(async (req, res) => {
  const { eventTypeId, date } = req.query;

  if (!eventTypeId || !date) {
    return res.status(400).json({ success: false, message: "eventTypeId and date are required" });
  }

  const eventType = await EventType.findById(eventTypeId);
  if (!eventType || !eventType.isActive) {
    return res.status(404).json({ success: false, message: "Event type not found" });
  }

  // Get available dates for the next 60 days (for calendar highlighting)
  if (req.query.month) {
    const [year, month] = req.query.month.split("-").map(Number);
    const daysInMonth   = new Date(year, month, 0).getDate();
    const availableDays = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const checkDate = new Date(year, month - 1, d);
      if (checkDate < new Date()) continue;
      const slots = await getAvailableSlots(eventType, checkDate);
      if (slots.length > 0) availableDays.push(d);
    }

    return res.status(200).json({ success: true, availableDays });
  }

  const slots = await getAvailableSlots(eventType, new Date(date));

  res.status(200).json({
    success: true,
    date,
    slots: slots.map((s) => ({
      start:     s.start.toISOString(),
      end:       s.end.toISOString(),
      startTime: s.start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
    })),
  });
});

// ─── @route  POST /api/bookings ───────────────────────────────────────────────
exports.createBooking = asyncHandler(async (req, res) => {
  const { eventTypeId, scheduledAt, invitee, timezone, answers } = req.body;

  const eventType = await EventType.findById(eventTypeId).populate("user");
  if (!eventType || !eventType.isActive) {
    return res.status(404).json({ success: false, message: "Event type not found or inactive" });
  }

  // Check slot is actually available
  const available = await isSlotAvailable(eventType, new Date(scheduledAt));
  if (!available) {
    return res.status(409).json({ success: false, message: "This time slot is no longer available. Please choose another." });
  }

  const booking = await Booking.create({
    eventType:   eventType._id,
    host:        eventType.user._id,
    invitee,
    scheduledAt: new Date(scheduledAt),
    duration:    eventType.duration,
    timezone:    timezone || eventType.user.timezone,
    location: {
      type:    eventType.locationType,
      detail:  eventType.locationDetails,
    },
    answers: answers || [],
  });

  // Update event type booking count
  await EventType.findByIdAndUpdate(eventTypeId, { $inc: { totalBookings: 1 } });

  // Send confirmation emails (non-blocking)
  const host = eventType.user;
  const inviteeTemplate = emailTemplates.bookingConfirmation(booking, eventType, host);
  const hostTemplate    = emailTemplates.bookingNotificationToHost(booking, eventType);

  await Promise.all([
    sendEmail({ to: invitee.email,  ...inviteeTemplate }),
    sendEmail({ to: host.email,     ...hostTemplate }),
  ]);

  // Return booking without sensitive tokens
  const populated = await Booking.findById(booking._id)
    .populate("eventType", "title duration color locationType")
    .populate("host", "name email username avatar");

  res.status(201).json({
    success: true,
    message: "Booking confirmed!",
    booking: populated,
  });
});

// ─── @route  GET  /api/bookings ───────────────────────────────────────────────
// Host: get all their bookings with filters
exports.getMyBookings = asyncHandler(async (req, res) => {
  const { status, from, to, page = 1, limit = 20 } = req.query;

  const filter = { host: req.user._id };
  if (status) filter.status = status;
  if (from || to) {
    filter.scheduledAt = {};
    if (from) filter.scheduledAt.$gte = new Date(from);
    if (to)   filter.scheduledAt.$lte = new Date(to);
  }

  const skip  = (parseInt(page) - 1) * parseInt(limit);
  const total = await Booking.countDocuments(filter);

  const bookings = await Booking.find(filter)
    .populate("eventType", "title color duration")
    .sort({ scheduledAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    total,
    page:    parseInt(page),
    pages:   Math.ceil(total / parseInt(limit)),
    bookings,
  });
});

// ─── @route  GET  /api/bookings/:id ──────────────────────────────────────────
exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("eventType", "title duration color locationType locationDetails")
    .populate("host", "name email username avatar timezone");

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  // Allow host or invitee (by token) to view
  const isHost = booking.host._id.toString() === req.user?._id?.toString();
  if (!isHost) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  res.status(200).json({ success: true, booking });
});

// ─── @route  PUT  /api/bookings/:id/cancel ───────────────────────────────────
exports.cancelBooking = asyncHandler(async (req, res) => {
  const { reason, token } = req.body;

  const booking = await Booking.findById(req.params.id)
    .select("+cancelToken")
    .populate("eventType", "title")
    .populate("host", "name email");

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  if (booking.status === "cancelled") {
    return res.status(400).json({ success: false, message: "Booking is already cancelled" });
  }

  // Auth: either logged-in host OR valid cancel token (for invitee)
  const isHost       = req.user && booking.host._id.toString() === req.user._id.toString();
  const isValidToken = token && token === booking.cancelToken;

  if (!isHost && !isValidToken) {
    return res.status(403).json({ success: false, message: "Not authorized to cancel this booking" });
  }

  booking.status = "cancelled";
  booking.cancellation = {
    cancelledAt: new Date(),
    cancelledBy: isHost ? "host" : "invitee",
    reason:      reason || "No reason provided",
  };
  await booking.save();

  // Notify both parties
  const cancelTemplate = emailTemplates.bookingCancellation(booking, booking.eventType);
  await Promise.all([
    sendEmail({ to: booking.invitee.email, ...cancelTemplate }),
    sendEmail({ to: booking.host.email,    ...cancelTemplate }),
  ]);

  res.status(200).json({ success: true, message: "Booking cancelled", booking });
});

// ─── @route  PUT  /api/bookings/:id/reschedule ───────────────────────────────
exports.rescheduleBooking = asyncHandler(async (req, res) => {
  const { newScheduledAt, token } = req.body;

  const booking = await Booking.findById(req.params.id)
    .select("+rescheduleToken")
    .populate("eventType")
    .populate("host", "name email");

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  const isHost       = req.user && booking.host._id.toString() === req.user._id.toString();
  const isValidToken = token && token === booking.rescheduleToken;

  if (!isHost && !isValidToken) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  // Verify new slot is available
  const available = await isSlotAvailable(booking.eventType, new Date(newScheduledAt));
  if (!available) {
    return res.status(409).json({ success: false, message: "Selected time slot is not available" });
  }

  // Create new booking, cancel old one
  const newBooking = await Booking.create({
    eventType:        booking.eventType._id,
    host:             booking.host._id,
    invitee:          booking.invitee,
    scheduledAt:      new Date(newScheduledAt),
    duration:         booking.duration,
    timezone:         booking.timezone,
    location:         booking.location,
    answers:          booking.answers,
    rescheduledFrom:  booking._id,
  });

  booking.status = "cancelled";
  booking.cancellation = { cancelledAt: new Date(), cancelledBy: isHost ? "host" : "invitee", reason: "Rescheduled" };
  await booking.save();

  res.status(201).json({ success: true, message: "Booking rescheduled", booking: newBooking });
});

// ─── @route  PUT  /api/bookings/:id/complete ─────────────────────────────────
exports.markComplete = asyncHandler(async (req, res) => {
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, host: req.user._id, status: "confirmed" },
    { status: "completed" },
    { new: true }
  );

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found or already completed" });
  }

  res.status(200).json({ success: true, message: "Booking marked as completed", booking });
});
