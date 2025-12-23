


// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import mongoose from "mongoose";
// import chatRoutes from "./routes/chat.js";
// import { Groq } from "groq-sdk";

// const app = express();
// const PORT = 8080;

// app.use(express.json());
// app.use(cors());

// // 🔥 Initialize Groq Client
// const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY
// });

// // 🟢 Test Route (Groq Chat Completion)
// app.post("/test", async (req, res) => {
//     try {
//         const completion = await groq.chat.completions.create({
//             model: "llama-3.1-70b-versatile",   // best model
//             messages: [
//                 {
//                     role: "user",
//                     content: req.body.message
//                 }
//             ]
//         });

//         const reply = completion.choices[0].message.content;
//         res.send(reply);

//     } catch (err) {
//         console.error("Groq Error:", err);
//         res.status(500).send("Error generating response");
//     }
// });

// app.use("/api", chatRoutes);

// // 🟢 Server Start
// app.listen(PORT, () => {
//     console.log(`server running on ${PORT}`);
//     connectDB();
// });

// // 🟢 Database Connection
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log("Connected with Database!");
//     } catch (err) {
//         console.log("Failed to connect with Db", err);
//     }
// };


//

// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import mongoose from "mongoose";
// import { Groq } from "groq-sdk";

// // Routes
// import chatRoutes from "./routes/chat.js";
// import authRoutes from "./routes/auth.js";




// const app = express();
// const PORT = process.env.PORT || 5001;

// /* -------------------- MIDDLEWARE -------------------- */
// app.use(express.json());
// app.use(cors({
//   origin: "http://localhost:5001", 
//   credentials: true
// }));

// /* -------------------- GROQ CLIENT -------------------- */
// export const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY
// });

// /* -------------------- HEALTH CHECK -------------------- */
// app.get("/test", (req, res) => {
//   res.json({ message: "Backend is running ✅" });
// });

// /* -------------------- AUTH ROUTES -------------------- */
// app.use("/", authRoutes); 
// // POST /login
// // POST /register

// /* -------------------- CHAT ROUTES -------------------- */
// app.use("/api", chatRoutes);

// /* -------------------- DATABASE -------------------- */
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("✅ MongoDB Connected");
//   } catch (err) {
//     console.error("❌ MongoDB Connection Failed:", err.message);
//     process.exit(1);
//   }
// };

// /* -------------------- START SERVER -------------------- */
// const startServer = async () => {
//   await connectDB();
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// };

// startServer();








// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import mongoose from "mongoose";
// import chatRoutes from "./routes/chat.js";
// import { Groq } from "groq-sdk";

// const app = express();
// const PORT = process.env.PORT || 5001;

// app.use(express.json());
// app.use(cors());

// // Initialize Groq Client
// const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY
// });

// // Test Route (Groq chat)
// app.post("/test", async (req, res) => {
//     try {
//         const completion = await groq.chat.completions.create({
//             model: "llama-3.1-70b-versatile",
//             messages: [{ role: "user", content: req.body.message }]
//         });

//         const reply = completion.choices[0].message.content;
//         res.send(reply);

//     } catch (err) {
//         console.error("Groq Error:", err);
//         res.status(500).send("Error generating response");
//     }
// });

// app.use("/api", chatRoutes);

// // Database Connect
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI, {
//             serverSelectionTimeoutMS: 9000,
//             connectTimeoutMS: 9000
//         });
//         console.log("Connected with Database!");
//     } catch (err) {
//         console.log("Failed to connect with DB", err);
//         throw err;
//     }
// };

// // Start server only after DB connects
// const startServer = async () => {
//     try {
//         await connectDB();
//         app.listen(PORT, () => console.log(`Server running on ${PORT}`));
//     } catch (err) {
//         console.log("Server failed:", err);
//     }
// };

// startServer();

////
//
//

import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 5001;

/* ---------------- MIDDLEWARES ---------------- */
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

/* ---------------- HEALTH CHECK ---------------- */
app.get("/test", (req, res) => {
  res.json({ status: "Backend running ✅" });
});

/* ---------------- API ROUTES ---------------- */
app.use("/api", chatRoutes);

/* ---------------- DB + SERVER ---------------- */
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
