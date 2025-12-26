import { createContext } from "react";

export const MyContext = createContext({
  prompt: "",
  setPrompt: () => {},

  reply: null,
  setReply: () => {},

  currThreadId: "",
  setCurrThreadId: () => {},

  prevChats: [],
  setPrevChats: () => {},

  newChat: true,
  setNewChat: () => {},

  allThreads: [],
  setAllThreads: () => {},

  // 🔥 MOBILE SIDEBAR STATE
  showSidebar: false,
  setShowSidebar: () => {}
});

