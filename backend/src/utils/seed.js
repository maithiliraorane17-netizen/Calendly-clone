require("dotenv").config();
const mongoose  = require("mongoose");
const connectDB = require("../config/db");
const User      = require("../models/User");
const EventType = require("../models/EventType");
const Booking   = require("../models/Booking");

const seed = async () => {
  await connectDB();
  console.log("Seeding database...\n");

  // Clean existing data
  await User.deleteMany({});
  await EventType.deleteMany({});
  await Booking.deleteMany({});
  console.log("Cleared existing data");

  // Create demo user
  const user = await User.create({
    name:     "Maithili Thakur",
    email:    "maithili@demo.com",
    password: "password123",
    username: "maithili",
    bio:      "Full-stack developer | MERN stack enthusiast",
    timezone: "Asia/Kolkata",
    plan:     "standard",
  });
  console.log(`User created: ${user.email}`);

  // Create event types
  const eventTypes = await EventType.create([
    {
      user:        user._id,
      title:       "Quick Chat",
      description: "A quick 15-minute intro call",
      duration:    15,
      color:       "#06B6D4",
      locationType: "google_meet",
    },
    {
      user:        user._id,
      title:       "30 Minute Meeting",
      description: "Standard meeting for discussions",
      duration:    30,
      color:       "#8B5CF6",
      locationType: "zoom",
    },
    {
      user:        user._id,
      title:       "Product Demo",
      description: "Full product walkthrough — 45 minutes",
      duration:    45,
      color:       "#EC4899",
      locationType: "google_meet",
      questions: [
        { label: "What product are you interested in?", type: "text",     required: true },
        { label: "Company size?",                       type: "select",   options: ["1-10", "11-50", "51-200", "200+"], required: false },
      ],
    },
  ]);
  console.log(`${eventTypes.length} event types created`);

  // Create sample bookings
  const futureDate = (daysAhead, hour) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  await Booking.create([
    {
      eventType:   eventTypes[1]._id,
      host:        user._id,
      invitee:     { name: "Alex Chen", email: "alex@example.com", notes: "Discussed project scope" },
      scheduledAt: futureDate(1, 14),
      duration:    30,
      timezone:    "Asia/Kolkata",
      status:      "confirmed",
    },
    {
      eventType:   eventTypes[2]._id,
      host:        user._id,
      invitee:     { name: "Priya Sharma", email: "priya@example.com" },
      scheduledAt: futureDate(2, 10),
      duration:    45,
      timezone:    "Asia/Kolkata",
      status:      "confirmed",
    },
    {
      eventType:   eventTypes[0]._id,
      host:        user._id,
      invitee:     { name: "Rahul Verma", email: "rahul@example.com" },
      scheduledAt: futureDate(-2, 11),
      duration:    15,
      timezone:    "Asia/Kolkata",
      status:      "completed",
    },
  ]);
  console.log("Sample bookings created");

  console.log("\n Seed complete!");
  console.log("─────────────────────────────");
  console.log("Email:    maithili@demo.com");
  console.log("Password: password123");
  console.log("─────────────────────────────\n");

  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
