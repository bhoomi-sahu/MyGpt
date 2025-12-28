import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 5001;

/* ================= MIDDLEWARE ================= */
app.use(express.json());

// CORS: allow both local dev and deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mygpt-frontend.onrender.com" // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true
  })
);

// Handle preflight OPTIONS requests
app.options("*", cors({ origin: allowedOrigins, credentials: true }));

/* ================= ROUTES ================= */

// Root route (check deployment)
app.get("/", (req, res) => {
  res.send("🚀 MyGPT Backend is Live");
});

// Health check
app.get("/test", (req, res) => {
  res.json({ status: "Backend running ✅" });
});

// API routes
app.use("/api", chatRoutes);

/* ================= SERVER START ================= */
const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server failed:", err.message);
    process.exit(1);
  }
};

startServer();
