const express = require("express");
const router  = express.Router();
const { protect, optionalAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  getMyEventTypes,
  createEventType,  createEventTypeRules,
  getEventType,
  updateEventType,
  deleteEventType,
  toggleEventType,
  getPublicEventType,
} = require("../controllers/eventTypeController");

// Public route — booking page fetches this
router.get("/public/:username/:slug", optionalAuth, getPublicEventType);

// All routes below require auth
router.use(protect);

router.route("/")
  .get(getMyEventTypes)
  .post(createEventTypeRules, validate, createEventType);

router.route("/:id")
  .get(getEventType)
  .put(updateEventType)
  .delete(deleteEventType);

router.put("/:id/toggle", toggleEventType);

module.exports = router;
