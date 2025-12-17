const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

/* ✅ CORS — MUST BE FIRST */
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


/* ✅ Body parser */
app.use(express.json());

/* ✅ ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

/* ✅ TEST PROTECTED ROUTE */
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

/* ✅ ROOT */
app.get("/", (req, res) => {
  res.send("Backend running");
});

/* ✅ START SERVER (ALWAYS LAST) */
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
