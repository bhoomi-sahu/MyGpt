// import './App.css';
// import Sidebar from "./Sidebar.jsx";
// import ChatWindow from "./ChatWindow.jsx";
// // import Login from "./Login.jsx";
// import { MyContext } from "./MyContext.jsx";
// import { useState } from 'react';
// import { v1 as uuidv1 } from "uuid";

// function App() {
//   const token = localStorage.getItem("token");

//   const [prompt, setPrompt] = useState("");
//   const [reply, setReply] = useState(null);
//   const [currThreadId, setCurrThreadId] = useState(uuidv1());
//   const [prevChats, setPrevChats] = useState([]);
//   const [newChat, setNewChat] = useState(true);
//   const [allThreads, setAllThreads] = useState([]);

//   const providerValues = {
//     prompt, setPrompt,
//     reply, setReply,
//     currThreadId, setCurrThreadId,
//     newChat, setNewChat,
//     prevChats, setPrevChats,
//     allThreads, setAllThreads
//   };

//   // 🔐 IF NOT LOGGED IN → SHOW LOGIN
//   if (!token) {
//     return <Login />;
//   }

//   // ✅ IF LOGGED IN → SHOW CHAT APP
//   return (
//     <div className='app'>
//       <MyContext.Provider value={providerValues}>
//         <Sidebar />
//         <ChatWindow />
//       </MyContext.Provider>
//     </div>
//   );
// }

// export default App;


import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import {MyContext} from "./MyContext.jsx";
import { useState } from 'react';
import {v1 as uuidv1} from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  }; 

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
        </MyContext.Provider>
    </div>
  )
}

export default App


