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
    setPrevChats
  } = useContext(MyContext);

  const getAllThreads = async () => {
    const res = await fetch("http://localhost:5001/api/thread");
    const data = await res.json();
    setAllThreads(data);
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (id) => {
    setCurrThreadId(id);
    const res = await fetch(`http://localhost:5001/api/thread/${id}`);
    const data = await res.json();
    setPrevChats(data);
    setNewChat(false);
    setReply(null);
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>➕ New Chat</button>

      <ul className="history">
        {allThreads.map(t => (
          <li
            key={t.threadId}
            className={t.threadId === currThreadId ? "highlighted" : ""}
            onClick={() => changeThread(t.threadId)}
          >
            {t.title}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Sidebar;
