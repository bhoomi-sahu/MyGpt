import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 5001;

/* ================= MIDDLEWARE ================= */
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "https://mygpt-frontend.onrender.com" // Render frontend
    ],
    credentials: true
  })
);

/* ================= ROUTES ================= */

// Root route (Render check)
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
