import "./Chat.css";
import React, { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply, sendMessage } = useContext(MyContext);

  const [latestReply, setLatestReply] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";

    recog.onresult = async (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      if (event.results[event.results.length - 1].isFinal) {
        setIsListening(false);
        await sendMessage(transcript.trim());
      }
    };

    recog.onerror = (e) => {
      console.log("Mic Error:", e.error);
      setIsListening(false);
    };

    recog.onend = () => setIsListening(false);

    recognitionRef.current = recog;
  }, [sendMessage]);

  const startListening = () => {
    const recog = recognitionRef.current;
    if (!recog) return;

    window.speechSynthesis.cancel();
    try {
      recog.start();
      setIsListening(true);
    } catch (err) {
      console.log("Mic start error:", err);
    }
  };

  const stopListening = () => {
    const recog = recognitionRef.current;
    if (recog) recog.stop();
    setIsListening(false);
  };

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }
    if (!prevChats?.length) return;

    const content = reply.split(" ");
    let idx = 0;

    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  const speakText = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <>
      {newChat && prevChats.length === 0 && (
        <h1 className="emptyTitle">Start a New Chat</h1>
      )}

      <div className="micContainer">
        {!isListening ? (
          <button className="micBtn" onClick={startListening}>
            🎤 Start Voice
          </button>
        ) : (
          <button className="micBtn stop" onClick={stopListening}>
            ⏹ Stop Listening
          </button>
        )}
      </div>

      <div className="chats">
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
                <button
                  className="speakReplyBtn"
                  onClick={() => speakText(chat.content)}
                >
                  🔊 Speak Reply
                </button>
              </>
            )}
          </div>
        ))}

        {prevChats.length > 0 && (
          <div className="gptDiv">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply ?? prevChats[prevChats.length - 1].content}
            </ReactMarkdown>
            <button
              className="speakReplyBtn"
              onClick={() =>
                speakText(latestReply ?? prevChats[prevChats.length - 1].content)
              }
            >
              🔊 Speak Reply
            </button>
            {isSpeaking && (
              <button className="speakReplyBtn" onClick={stopSpeaking}>
                ⏹ Stop
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
