import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 5001;


app.use(express.json());

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mygpt-frontend-i2v8.onrender.com" // deployed frontend
];

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }
  if (req.method === "OPTIONS") return res.sendStatus(200); // preflight
  next();
});



// Root route
app.get("/", (req, res) => {
  res.send("🚀 MyGPT Backend is Live");
});

// Health check
app.get("/test", (req, res) => {
  res.json({ status: "Backend running ✅" });
});

// API routes
app.use("/api", chatRoutes);


const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(" MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" MongoDB Connected");

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error(" Server failed:", err.message);
    process.exit(1);
  }
};

startServer();
