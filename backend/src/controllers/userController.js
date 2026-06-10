const path             = require("path");
const fs               = require("fs");
const { body }         = require("express-validator");
const User             = require("../models/User");
const Booking          = require("../models/Booking");
const EventType        = require("../models/EventType");
const { asyncHandler } = require("../middleware/errorHandler");

// ─── Validation ──────────────────────────────────────────────────────────────
exports.updateProfileRules = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 40 })
    .matches(/^[a-z0-9_-]+$/)
    .withMessage("Username: 3-40 chars, lowercase letters, numbers, - or _ only"),
  body("timezone").optional().trim(),
  body("bio").optional().trim().isLength({ max: 300 }).withMessage("Bio max 300 characters"),
];

// ─── @route  GET  /api/users/profile ─────────────────────────────────────────
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, user: user.toPublicProfile() });
});

// ─── @route  PUT  /api/users/profile ─────────────────────────────────────────
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "username", "timezone", "bio", "bookingPageSettings"];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  // Check username uniqueness
  if (updates.username) {
    const taken = await User.findOne({ username: updates.username, _id: { $ne: req.user._id } });
    if (taken) {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new:              true,
    runValidators:    true,
  });

  res.status(200).json({ success: true, message: "Profile updated", user: user.toPublicProfile() });
});

// ─── @route  PUT  /api/users/avatar ──────────────────────────────────────────
exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Please upload an image file" });
  }

  // Delete old avatar
  const user = await User.findById(req.user._id);
  if (user.avatar) {
    const oldPath = path.join(__dirname, "../../", user.avatar);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  const avatarPath = `/uploads/${req.file.filename}`;
  user.avatar = avatarPath;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Avatar updated", avatar: avatarPath });
});

// ─── @route  PUT  /api/users/change-password ─────────────────────────────────
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Current password is incorrect" });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: "Password changed successfully" });
});

// ─── @route  GET  /api/users/dashboard-stats ─────────────────────────────────
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now    = new Date();

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [totalBookings, monthBookings, upcomingBookings, eventTypes, completedBookings] =
    await Promise.all([
      Booking.countDocuments({ host: userId, status: { $ne: "cancelled" } }),
      Booking.countDocuments({ host: userId, scheduledAt: { $gte: monthStart, $lte: monthEnd }, status: { $ne: "cancelled" } }),
      Booking.find({ host: userId, scheduledAt: { $gte: now }, status: "confirmed" })
        .sort({ scheduledAt: 1 })
        .limit(5)
        .populate("eventType", "title color duration"),
      EventType.find({ user: userId, isActive: true }),
      Booking.countDocuments({ host: userId, status: "completed" }),
    ]);

  const completionRate = totalBookings > 0
    ? Math.round((completedBookings / totalBookings) * 100)
    : 0;

  // Estimated hours saved (avg 20 min per meeting without scheduling tool)
  const hoursSaved = Math.round((totalBookings * 20) / 60);

  res.status(200).json({
    success: true,
    stats: {
      totalBookings,
      monthBookings,
      hoursSaved,
      completionRate,
      eventTypesCount: eventTypes.length,
    },
    upcomingBookings,
    eventTypes,
  });
});

// ─── @route  DELETE /api/users/account ───────────────────────────────────────
exports.deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Soft delete
  await User.findByIdAndUpdate(userId, { isActive: false });

  res.cookie("refreshToken", "none", { expires: new Date(Date.now() + 5000), httpOnly: true });
  res.status(200).json({ success: true, message: "Account deactivated successfully" });
});
