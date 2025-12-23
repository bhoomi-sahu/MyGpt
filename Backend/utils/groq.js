// import "dotenv/config";

// const getOpenAIAPIResponse = async(message) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [{
//                 role: "user",
//                 content: message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         return data.choices[0].message.content; //reply
//     } catch(err) {
//         console.log(err);
//     }
// }

// export default getOpenAIAPIResponse;

// import "dotenv/config";
// import { Groq } from "groq-sdk";

// // Initialize Groq Client
// const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY
// });

// // Function to get response from Groq
// const getGroqAPIResponse = async (message) => {
//     try {
//         const completion = await groq.chat.completions.create({
//             model: "llama-3.3-70b-versatile",
//             messages: [
//                 {
//                     role: "user",
//                     content: message
//                 }
//             ]
//         });

//         return completion.choices[0].message.content;  // reply
//     } catch (err) {
//         console.log("Groq API Error:", err);
//         return "Sorry, I am having trouble responding right now.";
//     }
// };

// export default getGroqAPIResponse;









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
