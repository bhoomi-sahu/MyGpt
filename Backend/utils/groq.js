
import "dotenv/config";
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getGroqAPIResponse = async (message) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ✅ WORKING & SUPPORTED
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    return completion.choices[0].message.content;

  } catch (err) {
    console.error("❌ Groq API Error:", err.response?.data || err.message);
    throw err; // backend ko error dikhane ke liye
  }
};

export default getGroqAPIResponse;
