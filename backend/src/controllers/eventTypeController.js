const { body }         = require("express-validator");
const EventType        = require("../models/EventType");
const Booking          = require("../models/Booking");
const { asyncHandler } = require("../middleware/errorHandler");

// ─── Validation rules ────────────────────────────────────────────────────────
exports.createEventTypeRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("duration")
    .isIn([15, 30, 45, 60, 90, 120])
    .withMessage("Duration must be 15, 30, 45, 60, 90, or 120 minutes"),
  body("locationType")
    .optional()
    .isIn(["zoom", "google_meet", "teams", "phone", "in_person", "custom"])
    .withMessage("Invalid location type"),
  body("color").optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage("Invalid color hex"),
];

// ─── @route  GET  /api/events ─────────────────────────────────────────────────
// Get all event types for logged-in user
exports.getMyEventTypes = asyncHandler(async (req, res) => {
  const eventTypes = await EventType.find({ user: req.user._id }).sort({ createdAt: -1 });

  // Attach booking count per event type
  const withStats = await Promise.all(
    eventTypes.map(async (et) => {
      const bookingsThisMonth = await Booking.countDocuments({
        eventType:   et._id,
        status:      { $ne: "cancelled" },
        scheduledAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      });
      return { ...et.toJSON(), bookingsThisMonth };
    })
  );

  res.status(200).json({ success: true, count: withStats.length, eventTypes: withStats });
});

// ─── @route  POST /api/events ─────────────────────────────────────────────────
exports.createEventType = asyncHandler(async (req, res) => {
  // Free plan: max 1 event type
  if (req.user.plan === "free") {
    const count = await EventType.countDocuments({ user: req.user._id });
    if (count >= 1) {
      return res.status(403).json({
        success: false,
        message: "Free plan allows only 1 event type. Upgrade to create more.",
      });
    }
  }

  const eventType = await EventType.create({ ...req.body, user: req.user._id });

  res.status(201).json({ success: true, message: "Event type created", eventType });
});

// ─── @route  GET  /api/events/:id ────────────────────────────────────────────
exports.getEventType = asyncHandler(async (req, res) => {
  const eventType = await EventType.findOne({
    _id:  req.params.id,
    user: req.user._id,
  });

  if (!eventType) {
    return res.status(404).json({ success: false, message: "Event type not found" });
  }

  res.status(200).json({ success: true, eventType });
});

// ─── @route  PUT  /api/events/:id ────────────────────────────────────────────
exports.updateEventType = asyncHandler(async (req, res) => {
  const allowed = [
    "title", "description", "duration", "color", "isActive",
    "locationType", "locationDetails", "availability",
    "bufferTimeBefore", "bufferTimeAfter", "minNotice",
    "maxDaysInAdvance", "questions", "isPaid", "price", "currency",
  ];

  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const eventType = await EventType.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!eventType) {
    return res.status(404).json({ success: false, message: "Event type not found" });
  }

  res.status(200).json({ success: true, message: "Event type updated", eventType });
});

// ─── @route  DELETE /api/events/:id ──────────────────────────────────────────
exports.deleteEventType = asyncHandler(async (req, res) => {
  const eventType = await EventType.findOne({ _id: req.params.id, user: req.user._id });

  if (!eventType) {
    return res.status(404).json({ success: false, message: "Event type not found" });
  }

  // Cancel all future bookings for this event type
  await Booking.updateMany(
    { eventType: eventType._id, scheduledAt: { $gte: new Date() }, status: "confirmed" },
    { status: "cancelled", "cancellation.reason": "Event type deleted by host" }
  );

  await eventType.deleteOne();

  res.status(200).json({ success: true, message: "Event type deleted" });
});

// ─── @route  PUT  /api/events/:id/toggle ─────────────────────────────────────
exports.toggleEventType = asyncHandler(async (req, res) => {
  const eventType = await EventType.findOne({ _id: req.params.id, user: req.user._id });

  if (!eventType) {
    return res.status(404).json({ success: false, message: "Event type not found" });
  }

  eventType.isActive = !eventType.isActive;
  await eventType.save();

  res.status(200).json({
    success: true,
    message: `Event type ${eventType.isActive ? "activated" : "deactivated"}`,
    isActive: eventType.isActive,
  });
});

// ─── @route  GET  /api/events/public/:username/:slug ─────────────────────────
// Public route — used by booking page
exports.getPublicEventType = asyncHandler(async (req, res) => {
  const User = require("../models/User");

  const host = await User.findOne({ username: req.params.username });
  if (!host) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const eventType = await EventType.findOne({
    user:     host._id,
    slug:     req.params.slug,
    isActive: true,
  });

  if (!eventType) {
    return res.status(404).json({ success: false, message: "Event type not found or inactive" });
  }

  res.status(200).json({
    success: true,
    eventType,
    host: host.toPublicProfile(),
  });
});
