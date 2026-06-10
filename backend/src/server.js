require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");
const path    = require("path");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");

// ─── Connect Database ─────────────────────────────────────────────────────────
connectDB();

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // allow serving uploaded images
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true, // allow cookies (refresh token)
  methods:     ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Static Files (uploaded avatars) ─────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Schedulely API is running 🚀",
    env:     process.env.NODE_ENV,
    time:    new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/users",    require("./routes/users"));
app.use("/api/events",   require("./routes/events"));
app.use("/api/bookings", require("./routes/bookings"));

// ─── 404 + Error Handlers ─────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n Schedulely API running in ${process.env.NODE_ENV} mode`);
  console.log(`http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health\n`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
