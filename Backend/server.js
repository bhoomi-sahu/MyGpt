
import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.get("/test", (req, res) => {
  res.json({ status: "Backend running ✅" });
});

/* ---------------- API ROUTES ---------------- */
app.use("/api", chatRoutes);


const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 11000,
      connectTimeoutMS: 11000
    });

    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Server failed:", err.message);
  }
};

startServer();
