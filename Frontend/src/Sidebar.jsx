import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    showSidebar,
    setShowSidebar
  } = useContext(MyContext);

  // 🔹 Fetch all threads
  const getAllThreads = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/thread");
      const data = await res.json();

      setAllThreads(
        data.map(t => ({
          threadId: t.threadId,
          title: t.title
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  // 🔹 New chat
  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    setShowSidebar(false); // ✅ close sidebar on mobile
  };

  // 🔹 Switch thread
  const changeThread = async (id) => {
    setCurrThreadId(id);

    try {
      const res = await fetch(`http://localhost:5001/api/thread/${id}`);
      const data = await res.json();

      setPrevChats(data.messages || []);
      setNewChat(false);
      setReply(null);
      setShowSidebar(false); // ✅ close sidebar
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className={`sidebar ${showSidebar ? "open" : ""}`}>
      
      {/* ❌ Close button (mobile only) */}
      <button
        className="closeBtn"
        onClick={() => setShowSidebar(false)}
        style={{ display: "none" }}
      >
        ✖
      </button>

      {/* ➕ New Chat */}
      <button onClick={createNewChat}>
        <img
          src="src/assets/blacklogo.png"
          alt="gpt logo"
          className="logo"
        />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/* 🕘 History */}
      <ul className="history">
        {allThreads.map((thread, idx) => (
          <li
            key={idx}
            className={
              thread.threadId === currThreadId ? "highlighted" : ""
            }
            onClick={() => changeThread(thread.threadId)}
          >
            {thread.title}
            <i className="fa-solid fa-trash"></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By Bhoomi Sahu ♥</p>
      </div>
    </section>
  );
}

export default Sidebar;
