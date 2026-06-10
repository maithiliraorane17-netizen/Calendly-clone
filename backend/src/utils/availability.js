const Booking = require("../models/Booking");

const DAYS = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

/**
 * Get all available time slots for an event type on a given date
 * @param {Object} eventType  - EventType document
 * @param {Date}   date       - The date to check
 * @returns {Array}           - Array of { start, end } Date objects
 */
const getAvailableSlots = async (eventType, date) => {
  const dayName = DAYS[date.getDay()];
  const dayRule = eventType.availability.find((a) => a.day === dayName);

  if (!dayRule || !dayRule.isAvailable) return [];

  // Parse working hours
  const [startH, startM] = dayRule.startTime.split(":").map(Number);
  const [endH,   endM]   = dayRule.endTime.split(":").map(Number);

  const workStart = new Date(date);
  workStart.setHours(startH, startM, 0, 0);

  const workEnd = new Date(date);
  workEnd.setHours(endH, endM, 0, 0);

  const slotDuration   = eventType.duration;         // minutes
  const bufferBefore   = eventType.bufferTimeBefore; // minutes
  const bufferAfter    = eventType.bufferTimeAfter;  // minutes
  const totalSlotBlock = slotDuration + bufferBefore + bufferAfter;

  // Get existing bookings for this host on this date
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
  const dayEnd   = new Date(date); dayEnd.setHours(23, 59, 59, 999);

  const existingBookings = await Booking.find({
    host:        eventType.user,
    scheduledAt: { $gte: dayStart, $lte: dayEnd },
    status:      { $nin: ["cancelled"] },
  });

  // Build slots
  const slots = [];
  const now   = new Date();
  const minNoticeMs = (eventType.minNotice || 0) * 60 * 1000;

  let cursor = new Date(workStart);

  while (cursor.getTime() + slotDuration * 60000 <= workEnd.getTime()) {
    const slotStart = new Date(cursor);
    const slotEnd   = new Date(cursor.getTime() + slotDuration * 60000);

    // Skip past slots (+ min notice)
    if (slotStart.getTime() < now.getTime() + minNoticeMs) {
      cursor = new Date(cursor.getTime() + 30 * 60000);
      continue;
    }

    // Check conflict with existing bookings
    const bufStartMs = slotStart.getTime() - bufferBefore * 60000;
    const bufEndMs   = slotEnd.getTime()   + bufferAfter  * 60000;

    const hasConflict = existingBookings.some((b) => {
      const bStart = b.scheduledAt.getTime();
      const bEnd   = b.endTime.getTime();
      return bufStartMs < bEnd && bufEndMs > bStart;
    });

    if (!hasConflict) {
      slots.push({ start: slotStart, end: slotEnd });
    }

    cursor = new Date(cursor.getTime() + 30 * 60000); // 30-min increments
  }

  return slots;
};

/**
 * Check if a specific datetime is available
 */
const isSlotAvailable = async (eventType, scheduledAt) => {
  const date  = new Date(scheduledAt);
  const slots = await getAvailableSlots(eventType, date);
  const reqTs = date.getTime();
  return slots.some((s) => s.start.getTime() === reqTs);
};

module.exports = { getAvailableSlots, isSlotAvailable };
