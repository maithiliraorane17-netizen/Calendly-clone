const jwt = require("jsonwebtoken");

// Generate access token (short lived)
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Generate refresh token (long lived)
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });
};

// Send token response with cookie
const sendTokenResponse = (user, statusCode, res, message = "Success") => {
  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   30 * 24 * 60 * 60 * 1000, // 30 days
  };

  res
    .status(statusCode)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      success: true,
      message,
      accessToken,
      user: user.toPublicProfile(),
    });
};

module.exports = { generateAccessToken, generateRefreshToken, sendTokenResponse };
