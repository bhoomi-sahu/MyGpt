// import "./ChatWindow.css";
// import Chat from "./Chat.jsx";
// import { MyContext } from "./MyContext.jsx";
// import { useContext, useState, useEffect, useRef } from "react";
// import { ScaleLoader } from "react-spinners";

// function ChatWindow() {
//     const {
//         prompt,
//         setPrompt,
//         reply,
//         setReply,
//         currThreadId,
//         setPrevChats,
//         setNewChat
//     } = useContext(MyContext);

//     const [loading, setLoading] = useState(false);
//     const [isOpen, setIsOpen] = useState(false);
//     const [listening, setListening] = useState(false);

//     const recognitionRef = useRef(null);

//     // 🔐 GET TOKEN
//     const token = localStorage.getItem("token");

//     // 🔴 AUTO LOGOUT IF TOKEN MISSING
//     useEffect(() => {
//         if (!token) {
//             window.location.reload();
//         }
//     }, []);

//     // 🟢 LOGOUT FUNCTION
//     const logout = () => {
//         localStorage.removeItem("token");
//         window.location.reload();
//     };

//     // 🎤 SPEECH RECOGNITION
//     useEffect(() => {
//         if ("webkitSpeechRecognition" in window) {
//             const SpeechRecognition = window.webkitSpeechRecognition;
//             const recognition = new SpeechRecognition();
//             recognition.lang = "en-US";
//             recognition.continuous = false;
//             recognition.interimResults = false;

//             recognition.onstart = () => setListening(true);

//             recognition.onresult = (event) => {
//                 const text = event.results[0][0].transcript;
//                 setPrompt(text);
//             };

//             recognition.onend = () => setListening(false);

//             recognitionRef.current = recognition;
//         }
//     }, []);

//     const startListening = () => {
//         if (recognitionRef.current) {
//             recognitionRef.current.start();
//         } else {
//             alert("Voice input not supported");
//         }
//     };

//     // 🟢 SEND MESSAGE (TOKEN ADDED)
//     const getReply = async () => {
//         if (!prompt.trim()) return;

//         setLoading(true);
//         setNewChat(false);

//         try {
//             const response = await fetch("http://localhost:8080/api/chat", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": token   // 🔐 TOKEN SENT
//                 },
//                 body: JSON.stringify({
//                     message: prompt,
//                     threadId: currThreadId,
//                 }),
//             });

//             // 🔴 IF TOKEN INVALID → LOGOUT
//             if (response.status === 401) {
//                 logout();
//                 return;
//             }

//             const res = await response.json();
//             setReply(res.reply);

//         } catch (err) {
//             console.log("ERROR:", err);
//         }

//         setLoading(false);
//     };

//     // 🟢 UPDATE CHAT HISTORY
//     useEffect(() => {
//         if (prompt && reply) {
//             setPrevChats((prev) => [
//                 ...prev,
//                 { role: "user", content: prompt },
//                 { role: "assistant", content: reply },
//             ]);
//         }
//         setPrompt("");
//     }, [reply]);

//     const handleProfileClick = () => setIsOpen(!isOpen);

//     // 🔊 TEXT TO SPEECH
//     const speakReply = () => {
//         if (!reply) return;
//         window.speechSynthesis.cancel();
//         const speech = new SpeechSynthesisUtterance(reply);
//         window.speechSynthesis.speak(speech);
//     };

//     return (
//         <div className="chatWindow">
//             {/* NAVBAR */}
//             <div className="navbar">
//                 <span>
//                     GPT <i className="fa-solid fa-chevron-down"></i>
//                 </span>

//                 <div className="userIconDiv" onClick={handleProfileClick}>
//                     <span className="userIcon">
//                         <i className="fa-solid fa-user"></i>
//                     </span>
//                 </div>
//             </div>

//             {/* DROPDOWN */}
//             {isOpen && (
//                 <div className="dropDown">
//                     <div className="dropDownItem">
//                         <i className="fa-solid fa-gear"></i> Settings
//                     </div>

//                     <div className="dropDownItem">
//                         <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
//                     </div>

//                     {/* 🔴 LOGOUT WORKING */}
//                     <div className="dropDownItem" onClick={logout}>
//                         <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
//                     </div>
//                 </div>
//             )}

//             <Chat />

//             <ScaleLoader color="#fff" loading={loading} />

//             {/* INPUT */}
//             <div className="chatInput">
//                 <div className="inputBox">
//                     <input
//                         placeholder="Ask anything"
//                         value={prompt}
//                         onChange={(e) => setPrompt(e.target.value)}
//                         onKeyDown={(e) => e.key === "Enter" && getReply()}
//                     />

//                     <div id="mic" onClick={startListening}>
//                         <i className={`fa-solid fa-microphone ${listening ? "listening" : ""}`}></i>
//                     </div>

//                     <div id="submit" onClick={getReply}>
//                         <i className="fa-solid fa-paper-plane"></i>
//                     </div>
//                 </div>

//                 {reply && (
//                     <div className="speakReplyBtn" onClick={speakReply}>
//                         🔊 Speak Reply
//                     </div>
//                 )}

//                 <p className="info">
//                     GPT can make mistakes. Check important info.
//                 </p>
//             </div>
//         </div>
//     );
// }

// export default ChatWindow;


import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  /* ---------------- 🎤 SPEECH RECOGNITION ---------------- */
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (e) => {
      setPrompt(e.results[0][0].transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  /* ---------------- 🟢 SEND MESSAGE ---------------- */
  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setNewChat(false);

    // show user msg instantly
    setPrevChats(prev => [
      ...prev,
      { role: "user", content: prompt }
    ]);

    try {
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId
        })
      });

      const data = await response.json();

      setPrevChats(prev => [
        ...prev,
        { role: "assistant", content: data.reply }
      ]);

      setReply(data.reply);

    } catch (err) {
      console.error(err);
    }

    setPrompt("");
    setLoading(false);
  };

  /* ---------------- 🔊 SPEAK LAST REPLY ---------------- */
  const speakReply = () => {
    if (!reply) return;

    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(reply);
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="chatWindow">
      {/* NAVBAR */}
      <div className="navbar">
        <span>GPT</span>
      </div>

      {/* CHAT */}
      <Chat />

      {/* LOADER */}
      <ScaleLoader color="#fff" loading={loading} />

      {/* INPUT */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === "Enter" && getReply()}
          />

          {/* MIC */}
          <div id="mic" onClick={startListening}>
            <i className={`fa-solid fa-microphone ${listening ? "listening" : ""}`}></i>
          </div>

          {/* SEND */}
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        {/* SPEAK */}
        {reply && (
          <div className="speakReplyBtn" onClick={speakReply}>
            🔊 Speak Reply
          </div>
        )}

        <p className="info">
          GPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
