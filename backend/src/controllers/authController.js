const crypto           = require("crypto");
const jwt              = require("jsonwebtoken");
const { body }         = require("express-validator");
const User             = require("../models/User");
const { asyncHandler } = require("../middleware/errorHandler");
const { sendTokenResponse, generateAccessToken } = require("../utils/jwt");
const { sendEmail }    = require("../utils/email");

// ─── Validation rules ────────────────────────────────────────────────────────
exports.registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

exports.loginRules = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// ─── @route  POST /api/auth/register ─────────────────────────────────────────
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: "Email already registered" });
  }

  const user = await User.create({ name, email, password });

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 201, res, "Account created successfully");
});

// ─── @route  POST /api/auth/login ────────────────────────────────────────────
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.password) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  if (!user.isActive) {
    return res.status(401).json({ success: false, message: "Account deactivated. Contact support." });
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, "Logged in successfully");
});

// ─── @route  POST /api/auth/logout ───────────────────────────────────────────
exports.logout = asyncHandler(async (req, res) => {
  res.cookie("refreshToken", "none", {
    expires:  new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// ─── @route  GET  /api/auth/me ───────────────────────────────────────────────
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, user: user.toPublicProfile() });
});

// ─── @route  POST /api/auth/refresh ──────────────────────────────────────────
exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, message: "No refresh token" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return res.status(401).json({ success: false, message: "Invalid refresh token" });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }

  const accessToken = generateAccessToken(user._id);
  res.status(200).json({ success: true, accessToken });
});

// ─── @route  POST /api/auth/forgot-password ──────────────────────────────────
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // Don't leak if email exists
    return res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent." });
  }

  const resetToken  = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken  = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to:      user.email,
    subject: "🔐 Reset your Schedulely password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
  });

  res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent." });
});

// ─── @route  PUT  /api/auth/reset-password/:token ────────────────────────────
exports.resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken:  hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }

  user.password             = req.body.password;
  user.resetPasswordToken   = undefined;
  user.resetPasswordExpire  = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, "Password reset successful");
});
