const mongoose = require("mongoose");

const availabilitySlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      required: true,
    },
    isAvailable: { type: Boolean, default: true },
    startTime: { type: String, default: "09:00" }, // "HH:MM" format
    endTime: { type: String, default: "17:00" },
  },
  { _id: false }
);

const eventTypeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      enum: [15, 30, 45, 60, 90, 120],
      default: 30,
    },
    color: {
      type: String,
      default: "#8B5CF6",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    locationType: {
      type: String,
      enum: ["zoom", "google_meet", "teams", "phone", "in_person", "custom"],
      default: "google_meet",
    },
    locationDetails: {
      type: String,
      default: "",
    },
    // Weekly availability schedule
    availability: {
      type: [availabilitySlotSchema],
      default: () => [
        { day: "sunday",    isAvailable: false, startTime: "09:00", endTime: "17:00" },
        { day: "monday",    isAvailable: true,  startTime: "09:00", endTime: "17:00" },
        { day: "tuesday",   isAvailable: true,  startTime: "09:00", endTime: "17:00" },
        { day: "wednesday", isAvailable: true,  startTime: "09:00", endTime: "17:00" },
        { day: "thursday",  isAvailable: true,  startTime: "09:00", endTime: "17:00" },
        { day: "friday",    isAvailable: true,  startTime: "09:00", endTime: "17:00" },
        { day: "saturday",  isAvailable: false, startTime: "09:00", endTime: "17:00" },
      ],
    },
    bufferTimeBefore: { type: Number, default: 0 },   // minutes
    bufferTimeAfter:  { type: Number, default: 0 },
    minNotice: { type: Number, default: 60 },          // min booking notice in minutes
    maxDaysInAdvance: { type: Number, default: 60 },
    // Custom questions for invitee
    questions: [
      {
        label:    { type: String, required: true },
        type:     { type: String, enum: ["text", "textarea", "select", "checkbox"], default: "text" },
        options:  [String],
        required: { type: Boolean, default: false },
      },
    ],
    // Payment
    isPaid: { type: Boolean, default: false },
    price:  { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    // Stats
    totalBookings: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Auto-generate slug from title
eventTypeSchema.pre("save", async function () {
  if (!this.isModified("title") && this.slug) return;
  const base = this.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  let slug = base;
  let counter = 1;
  while (
    await mongoose.model("EventType").findOne({ user: this.user, slug, _id: { $ne: this._id } })
  ) {
    slug = `${base}-${counter++}`;
  }
  this.slug = slug;
 
});

// Virtual: full booking link
eventTypeSchema.virtual("bookingLink").get(function () {
  return `/book/${this._id}`;
});

// Compound index: one user can't have duplicate slugs
eventTypeSchema.index({ user: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("EventType", eventTypeSchema);
