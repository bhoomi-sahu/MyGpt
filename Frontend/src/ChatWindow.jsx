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
    setNewChat,
    setShowSidebar
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  // ✅ BACKEND API URL (Render / Local)
  const API = import.meta.env.VITE_API_URL;

  /* ================= SPEECH RECOGNITION ================= */
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

  /* ================= SEND MESSAGE ================= */
  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setNewChat(false);

    // show user message instantly
    setPrevChats(prev => [
      ...prev,
      { role: "user", content: prompt }
    ]);

    try {
      const response = await fetch(`${API}/api/chat`, {
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
      console.error("Chat error:", err);
      alert("Backend not responding");
    }

    setPrompt("");
    setLoading(false);
  };

  /* ================= TEXT TO SPEECH ================= */
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
      {/* ================= NAVBAR ================= */}
      <div className="navbar">
        <i
          className="fa-solid fa-bars mobileMenu"
          onClick={() => setShowSidebar(true)}
        ></i>

        <span>GPT</span>

        <div className="userIconDiv">
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {/* ================= CHAT ================= */}
      <Chat />

      {/* ================= LOADER ================= */}
      <ScaleLoader color="#fff" loading={loading} />

      {/* ================= INPUT ================= */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === "Enter" && getReply()}
          />

          {/* 🎤 MIC */}
          <div id="mic" onClick={startListening}>
            <i
              className={`fa-solid fa-microphone ${
                listening ? "listening" : ""
              }`}
            ></i>
          </div>

          {/* 📩 SEND */}
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        {/* 🔊 SPEAK */}
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


