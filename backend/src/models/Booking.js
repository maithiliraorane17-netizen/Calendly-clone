const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const bookingSchema = new mongoose.Schema(
    {
        // Unique booking reference (shown to invitee)
        bookingRef: {
            type: String,
            unique: true,
            default: () => uuidv4().slice(0, 8).toUpperCase(),
        },
        // The event type being booked
        eventType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EventType",
            required: true,
        },
        // The host (owner of the event type)
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Invitee details (person booking the meeting)
        invitee: {
            name:  { type: String, required: [true, "Invitee name is required"], trim: true },
            email: { type: String, required: [true, "Invitee email is required"], lowercase: true, trim: true },
            phone: { type: String, default: "" },
            notes: { type: String, default: "" },
        },
        // Scheduled time
        scheduledAt: {
            type: Date,
            required: [true, "Scheduled date/time is required"],
        },
        // Duration in minutes (copied from event type at booking time)
        duration: {
            type: Number,
            required:true,
        },
        endTime: {
            type: Date,
        },
        timezone: {
            type: String,
            default: "Asia/Kolkata",
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed", "no_show"],
            default: "confirmed",
        },
        // Meeting location/link
        location: {
            type:   { type: String },
            detail: { type: String },
            meetingLink: { type: String },
        },
        // Custom question answers
        answers: [
           {
           question: String,
           answer:   String,
           },
        ],
        // Cancellation details
        cancellation: {
           cancelledAt: Date,
           cancelledBy: { type: String, enum: ["host", "invitee"] },
           reason: String,
        },
        // Reschedule
        rescheduledFrom: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Booking",
           default: null,
        },
        // Reminders sent
        reminderSent: { type: Boolean, default: false },
        // Tokens for cancel/reschedule without login
        cancelToken:     { type: String, select: false },
        rescheduleToken: { type: String, select: false },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

// Auto-calculate endTime before save
bookingSchema.pre("save", function () {
  if (this.scheduledAt && this.duration) {
    this.endTime = new Date(this.scheduledAt.getTime() + this.duration * 60 * 1000);
  }
  // Generate cancel/reschedule tokens
  if (!this.cancelToken)     this.cancelToken     = uuidv4();
  if (!this.rescheduleToken) this.rescheduleToken = uuidv4();
  
});

// Indexes for fast queries
bookingSchema.index({ host: 1, scheduledAt: -1 });
bookingSchema.index({ "invitee.email": 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingRef: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
