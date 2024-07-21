import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import WestIcon from "@mui/icons-material/West";
import moment from "moment";
import { Box, CircularProgress } from "@mui/material";
import Cookies from "universal-cookie";
import { useAtom } from "jotai";
import { NavigateNameAtom, userProfileName } from "atom/atom";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const COMMON_ROOM_ID = "ExpenseAllUserChat"; // Replace with your actual common room ID

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
  const [isNavigate] = useAtom(NavigateNameAtom);
  console.log("isNavigate", isNavigate);
  const router = useRouter();
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

  const [, setIsNavigate] = useAtom(NavigateNameAtom); // Use atom to manage navigation state

  const handleNavigateHome = () => {
    setIsNavigate("Home");
  };
  return (
    <div className="flex flex-col h-screen bg-gray-100 pb-16">
      {/* Header */}
      <div className="flex items-center p-2 border-b border-black bg-red-600 text-white fixed top-0 left-0 w-full z-50">
        <div className="" onClick={handleNavigateHome}>
          <WestIcon className="w-8 h-8 ml-2" />
        </div>
        <FaUserCircle className="w-8 h-10 ml-2" />
        <div className="font-semibold text-center flex-grow">
          <p className="text-md text-start ps-2 mt-0">
            {loading ? "Loading..." : "Chat Room".toUpperCase()}
          </p>
          <p className="text-SM text-start ps-2">
            {typing && <p className="text-sm">{getUserName} Typing...</p>}
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div
        className="flex-grow overflow-y-auto px-2 pt-5 bg-gray-100"
        ref={containRef}
      >
        <div className="space-y-2">
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
                        ? "bg-red-600 text-white"
                        : "bg-white"
                    } text-dark`}
                  >
                    <div className="flex flex-col">
                      {MobileNumber !== data.mobileNo && (
                        <span className="font-bold">{data.user}:</span>
                      )}
                      <span className="whitespace-pre-wrap">{data.text}</span>
                      <div className="text-xs text-white">
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
      <div className="fixed bottom-0 z-50 bg-slate-200 left-0 w-full p-2 border-t border-gray-300 flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b54949] focus:border-transparent"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          className="ml-2 px-4 py-3 bg-red-500 text-white p-2 rounded-md flex items-center justify-center"
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

export default dynamic(() => Promise.resolve(Chat), { ssr: false });
