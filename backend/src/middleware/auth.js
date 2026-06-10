const jwt      = require("jsonwebtoken");
const User     = require("../models/User");

// ─── Protect: JWT required ───────────────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: "Account has been deactivated." });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

// ─── Optional auth: attaches user if token present, proceeds either way ─────
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user      = await User.findById(decoded.id);
    }
  } catch (_) {
    // silently ignore
  }
  next();
};

// ─── Plan guard ──────────────────────────────────────────────────────────────
const requirePlan = (...plans) => (req, res, next) => {
  if (!plans.includes(req.user.plan)) {
    return res.status(403).json({
      success: false,
      message: `This feature requires one of the following plans: ${plans.join(", ")}.`,
    });
  }
  next();
};

module.exports = { protect, optionalAuth, requirePlan };
