// import express from "express";
// import Thread from "../models/Thread.js";
// import getOpenAIAPIResponse from "../utils/openai.js";

// const router = express.Router();

// //test
// router.post("/test", async(req, res) => {
//     try {
//         const thread = new Thread({
//             threadId: "abc",
//             title: "Testing New Thread2"
//         });

//         const response = await thread.save();
//         res.send(response);
//     } catch(err) {
//         console.log(err);
//         res.status(500).json({error: "Failed to save in DB"});
//     }
// });

// //Get all threads
// router.get("/thread", async(req, res) => {
//     try {
//         const threads = await Thread.find({}).sort({updatedAt: -1});
//         //descending order of updatedAt...most recent data on top
//         res.json(threads);
//     } catch(err) {
//         console.log(err);
//         res.status(500).json({error: "Failed to fetch threads"});
//     }
// });

// router.get("/thread/:threadId", async(req, res) => {
//     const {threadId} = req.params;

//     try {
//         const thread = await Thread.findOne({threadId});

//         if(!thread) {
//             res.status(404).json({error: "Thread not found"});
//         }

//         res.json(thread.messages);
//     } catch(err) {
//         console.log(err);
//         res.status(500).json({error: "Failed to fetch chat"});
//     }
// });

// router.delete("/thread/:threadId", async (req, res) => {
//     const {threadId} = req.params;

//     try {
//         const deletedThread = await Thread.findOneAndDelete({threadId});

//         if(!deletedThread) {
//             res.status(404).json({error: "Thread not found"});
//         }

//         res.status(200).json({success : "Thread deleted successfully"});

//     } catch(err) {
//         console.log(err);
//         res.status(500).json({error: "Failed to delete thread"});
//     }
// });

// router.post("/chat", async(req, res) => {
//     const {threadId, message} = req.body;

//     if(!threadId || !message) {
//         res.status(400).json({error: "missing required fields"});
//     }

//     try {
//         let thread = await Thread.findOne({threadId});

//         if(!thread) {
//             //create a new thread in Db
//             thread = new Thread({
//                 threadId,
//                 title: message,
//                 messages: [{role: "user", content: message}]
//             });
//         } else {
//             thread.messages.push({role: "user", content: message});
//         }

//         const assistantReply = await getOpenAIAPIResponse(message);

//         thread.messages.push({role: "assistant", content: assistantReply});
//         thread.updatedAt = new Date();

//         await thread.save();
//         res.json({reply: assistantReply});
//     } catch(err) {
//         console.log(err);
//         res.status(500).json({error: "something went wrong"});
//     }
// });




// export default router;

// import express from "express";
// import Thread from "../models/Thread.js";
// import getGroqAPIResponse from "../utils/groq.js";   // ⬅ new utils file

// const router = express.Router();

// /* ----------------------- TEST SAVE ROUTE ----------------------- */
// router.post("/test", async (req, res) => {
//     try {
//         const thread = new Thread({
//             threadId: "abc",
//             title: "Testing New Thread 2"
//         });

//         const response = await thread.save();
//         res.send(response);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Failed to save in DB" });
//     }
// });

// /* ----------------------- GET ALL THREADS ----------------------- */
// router.get("/thread", async (req, res) => {
//     try {
//         const threads = await Thread.find({}).sort({ updatedAt: -1 });
//         res.json(threads);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Failed to fetch threads" });
//     }
// });

// /* ----------------------- GET SINGLE THREAD ----------------------- */
// router.get("/thread/:threadId", async (req, res) => {
//     const { threadId } = req.params;

//     try {
//         const thread = await Thread.findOne({ threadId });

//         if (!thread) {
//             return res.status(404).json({ error: "Thread not found" });
//         }

//         res.json(thread.messages);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Failed to fetch chat" });
//     }
// });

// /* ----------------------- DELETE THREAD ----------------------- */
// router.delete("/thread/:threadId", async (req, res) => {
//     const { threadId } = req.params;

//     try {
//         const deletedThread = await Thread.findOneAndDelete({ threadId });

//         if (!deletedThread) {
//             return res.status(404).json({ error: "Thread not found" });
//         }

//         res.status(200).json({ success: "Thread deleted successfully" });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Failed to delete thread" });
//     }
// });

// /* ----------------------- MAIN CHAT ROUTE ----------------------- */
// router.post("/chat", async (req, res) => {
//     const { threadId, message } = req.body;

//     if (!threadId || !message) {
//         return res.status(400).json({ error: "Missing required fields" });
//     }

//     try {
//         let thread = await Thread.findOne({ threadId });

//         // If no thread → create
//         if (!thread) {
//             thread = new Thread({
//                 threadId,
//                 title: message,
//                 messages: [{ role: "user", content: message }]
//             });
//         } else {
//             // Add user message
//             thread.messages.push({ role: "user", content: message });
//         }

//         // 🔥 Get reply from Groq
//         const assistantReply = await getGroqAPIResponse(message);

//         // Save assistant reply
//         thread.messages.push({ role: "assistant", content: assistantReply });
//         thread.updatedAt = new Date();

//         await thread.save();

//         res.json({ reply: assistantReply });

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Something went wrong" });
//     }
// });

// /* ----------------------- EXPORT ROUTER ----------------------- */
// export default router;

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
