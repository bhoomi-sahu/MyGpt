
import express from "express";
import Thread from "../models/Thread.js";
import getGroqAPIResponse from "../utils/groq.js";

const router = express.Router();

/* GET all threads */
router.get("/thread", async (req, res) => {
  const threads = await Thread.find({})
    .sort({ updatedAt: -1 })
    .select("threadId title");

  res.json(threads);
});

/* GET single thread */
router.get("/thread/:threadId", async (req, res) => {
  const thread = await Thread.findOne({ threadId: req.params.threadId });
  if (!thread) return res.json([]);
  res.json(thread.messages);
});

/* DELETE thread */
router.delete("/thread/:threadId", async (req, res) => {
  await Thread.findOneAndDelete({ threadId: req.params.threadId });
  res.json({ success: true });
});

/* MAIN CHAT */
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  let thread = await Thread.findOne({ threadId });

  if (!thread) {
    thread = new Thread({
      threadId,
      title: message.slice(0, 30),
      messages: [],
    });
  }

  thread.messages.push({ role: "user", content: message });

  const reply = await getGroqAPIResponse(message);

  thread.messages.push({ role: "assistant", content: reply });
  thread.updatedAt = new Date();

  await thread.save();

  res.json({ reply });
});

export default router;
