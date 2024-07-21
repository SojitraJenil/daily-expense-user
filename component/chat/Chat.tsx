import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import Cookies from "universal-cookie";
import moment from "moment";
import { Box, CircularProgress } from "@mui/material";

// Define a TypeScript interface for message data
interface Message {
  id: string;
  text: string;
  createdAt: number;
  user: string;
  room: string;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const messagesRef = collection(db, "Message");
  const cookies = new Cookies();
  const authToken = cookies.get("token");
  const room = getCookie("mobileNumber");
  const containRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser.displayName || "Anonymous");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const queryMessages = query(messagesRef, where("room", "==", room || ""));
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Message[]; // Cast to Message[]
      const sortedMessages = messages.sort((a, b) => a.createdAt - b.createdAt);
      setLoading(false);
      setMessages(sortedMessages);
    });
    return () => unsubscribe();
  }, [room]);

  useEffect(() => {
    if (containRef.current) {
      containRef.current.scrollTop = containRef.current.scrollHeight;
    }
  }, [messages]);

  function getCookie(name: string) {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith(name + "=")) {
          return trimmedCookie.substring(name.length + 1);
        }
      }
    }
    return null;
  }

  async function sendMessage() {
    if (newMessage.trim() === "") {
      setError("Enter the text!");
      return;
    }

    setNewMessage("");
    const displayName = auth.currentUser?.displayName || "Anonymous";
    try {
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: new Date().getTime(),
        user: displayName,
        room,
      });
    } catch (error) {
      setError("Failed to send message.");
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
    setTyping(true);
  };

  useEffect(() => {
    const typingTimeout = setTimeout(() => setTyping(false), 1000);
    return () => clearTimeout(typingTimeout);
  }, [newMessage]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center p-2 border-b border-black bg-red-600 text-white fixed top-0 left-0 w-full z-50">
        <FaUserCircle className="w-8 h-8 ml-2" />
        <div className="font-semibold text-center flex-grow">
          <p className="text-lg">
            {loading ? "Loading..." : "Demo".toUpperCase()}
          </p>
          {typing && <p className="text-sm">Demo typing...</p>}
        </div>
      </div>

      {/* Messages Container */}
      <div
        className="flex-grow overflow-y-auto px-2 pt-14 pb-16 bg-gray-100"
        ref={containRef}
      >
        <div className="space-y-4">
          {loading ? (
            <Box className="flex justify-center items-center h-full">
              <CircularProgress />
            </Box>
          ) : (
            messages.map((data, index) => (
              <div key={index}>
                {(index === 0 ||
                  moment(data.createdAt).format("DD-MM-YYYY") !==
                    moment(messages[index - 1].createdAt).format(
                      "DD-MM-YYYY"
                    )) && (
                  <div className="text-center mb-2">
                    <span className="px-4 py-1 bg-gray-300 text-gray-800 rounded-md">
                      {moment(data.createdAt).format("DD-MM-YYYY")}
                    </span>
                  </div>
                )}
                <div
                  className={`flex ${
                    user === data.user ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`flex items-start ${
                      user === data.user ? "justify-start" : "hidden"
                    }`}
                  >
                    <FaUserCircle className="w-5 h-8 mr-2" />
                  </div>
                  <div
                    className={`p-2 max-w-[300px] rounded-lg ${
                      user === data.user ? "bg-[#D9FDD3]" : "bg-white"
                    } text-dark`}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`font-bold ${
                          user === data.user ? "hidden" : "block"
                        }`}
                      >
                        {data.user}:
                      </span>
                      <span className="whitespace-pre-wrap">{data.text}</span>
                      <div className="text-xs text-gray-500">
                        {moment(data.createdAt).format("hh:mm:ss A")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="fixed bottom-12 mb-3 z-50 bg-slate-200 left-0 w-full p-2 border-t border-gray-300 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#035F52] focus:border-transparent"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          className="ml-2 bg-[#035F52] text-white p-2 rounded-full flex items-center justify-center"
          type="button"
          onClick={sendMessage}
        >
          <IoSend />
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 p-2">{error}</p>}
    </div>
  );
}

export default Chat;
