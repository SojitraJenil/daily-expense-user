import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";
import moment from "moment";
import { Box, CircularProgress } from "@mui/material";
import Cookies from "universal-cookie";
import { useAtom } from "jotai";
import { userProfileName } from "atom/atom";

const COMMON_ROOM_ID = "ExpenseAllUserChat"; // Replace with your actual common room ID

// Define a TypeScript interface for message data
interface Message {
  id: string;
  text: string;
  createdAt: number;
  user: string;
  MobileNumber: string;
  mobileNo: string;
  room: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesRef = collection(db, "Message");
  const cookie = new Cookies();
  const MobileNumber = cookie.get("mobileNumber");
  const [getUserName] = useAtom(userProfileName);

  const containRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Message[];
      const sortedMessages = messages.sort((a, b) => a.createdAt - b.createdAt);
      setLoading(false);
      setMessages(sortedMessages);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (containRef.current) {
      containRef.current.scrollTop = containRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function sendMessage() {
    if (newMessage.trim() === "") {
      setError("Enter the text!");
      return;
    }

    setNewMessage("");
    const displayName = getUserName;
    try {
      await addDoc(messagesRef, {
        text: newMessage,
        mobileNo: MobileNumber,
        createdAt: new Date().getTime(),
        user: displayName,
        room: COMMON_ROOM_ID,
      });
    } catch (error) {
      console.error("Error sending message: ", error);
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
            {loading ? "Loading..." : "Common Chat".toUpperCase()}
          </p>
          {typing && <p className="text-sm">Typing...</p>}
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
              <div key={data.id}>
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
                    MobileNumber === data.mobileNo
                      ? "justify-end" // align right for current user's messages
                      : "justify-start" // align left for other users' messages
                  }`}
                >
                  {MobileNumber !== data.mobileNo && (
                    <FaUserCircle className="w-5 h-8 mr-2" />
                  )}
                  <div
                    className={`p-2 max-w-[300px] rounded-lg ${
                      MobileNumber === data.mobileNo
                        ? "bg-[#D9FDD3]"
                        : "bg-white"
                    } text-dark`}
                  >
                    <div className="flex flex-col">
                      {MobileNumber !== data.mobileNo && (
                        <span className="font-bold">{data.user}:</span>
                      )}
                      <span className="whitespace-pre-wrap">{data.text}</span>
                      <div className="text-xs text-gray-500">
                        {moment(data.createdAt).format("hh:mm A")}
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
          ref={inputRef}
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
};

export default Chat;
