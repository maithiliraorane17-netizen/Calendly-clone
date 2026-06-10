const express = require("express");
const router  = express.Router();
const { protect, optionalAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  getAvailability,
  createBooking,    createBookingRules,
  getMyBookings,
  getBooking,
  cancelBooking,
  rescheduleBooking,
  markComplete,
} = require("../controllers/bookingController");

// Public — anyone can check availability and book
router.get("/availability",            getAvailability);
router.post("/",  createBookingRules,  validate, createBooking);

// Cancel / reschedule can be done with token (no login needed for invitee)
router.put("/:id/cancel",      optionalAuth, cancelBooking);
router.put("/:id/reschedule",  optionalAuth, rescheduleBooking);

// Protected — host only
router.use(protect);
router.get("/",          getMyBookings);
router.get("/:id",       getBooking);
router.put("/:id/complete", markComplete);

module.exports = router;
