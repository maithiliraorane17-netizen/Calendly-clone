const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never returned in queries by default
    },
    avatar: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9_-]+$/, "Username can only contain letters, numbers, dashes, underscores"],
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    bio: {
      type: String,
      maxlength: [300, "Bio cannot exceed 300 characters"],
      default: "",
    },
    plan: {
      type: String,
      enum: ["free", "standard", "teams", "enterprise"],
      default: "free",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyToken: String,
    emailVerifyExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: {
      type: String,
      select: false,
    },
    googleId: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    // Calendly-style booking page settings
    bookingPageSettings: {
      welcomeMessage: { type: String, default: "Welcome! Please book a time with me." },
      brandColor: { type: String, default: "#8B5CF6" },
      hideBranding: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: full booking URL
userSchema.virtual("bookingUrl").get(function () {
  return `${process.env.CLIENT_URL || "http://localhost:5173"}/${this.username}`;
});

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  
});

// Auto-generate username from name if not provided
userSchema.pre("save", async function () {
  if (!this.username && this.name) {
    const base = this.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    let username = base;
    let counter = 1;
    while (await mongoose.model("User").findOne({ username })) {
      username = `${base}-${counter++}`;
    }
    this.username = username;
  }
  
});

// Method: compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method: safe public profile (no sensitive fields)
userSchema.methods.toPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    username: this.username,
    avatar: this.avatar,
    bio: this.bio,
    timezone: this.timezone,
    plan: this.plan,
    bookingUrl: this.bookingUrl,
    bookingPageSettings: this.bookingPageSettings,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
