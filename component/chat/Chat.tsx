/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { Box, CircularProgress } from "@mui/material";
import moment from "moment";
import Cookies from "universal-cookie";
import { useAtom } from "jotai";
import { NavigateNameAtom } from "atom/atom";
import io from "socket.io-client";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import useHome from "context/HomeContext";
import { showChatMessage } from "API/api";
import WestIcon from "@mui/icons-material/West";

const COMMON_ROOM_ID = "ExpenseAllUserChat";

interface Message {
  id: string;
  text: string;
  createdAt: number;
  author: string;
  mobileNo: string;
  _id: string;
  message: string;
  room: string;
}

const Chat = () => {
  const { userProfile, mobileNumber } = useHome();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const socket = io("https://daily-expense-api.onrender.com", {
    transports: ["websocket"],
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await showChatMessage();
        if (response) {
          setMessages(response);
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    socket.emit("join_room", COMMON_ROOM_ID);

    socket.on("receive_message", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit("send_message", {
        author: userProfile?.name || "User",
        message: newMessage,
        room: COMMON_ROOM_ID,
        createdAt: new Date().getTime(),
        mobileNo: mobileNumber,
      });
      setNewMessage("");
    } else {
      setError("Enter the text!");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
    setTyping(true);
  };

  useEffect(() => {
    const typingTimeout = setTimeout(() => setTyping(false), 1000);
    return () => clearTimeout(typingTimeout);
  }, [newMessage]);

  const [, setIsNavigate] = useAtom(NavigateNameAtom);

  const handleNavigateHome = () => {
    setIsNavigate("Home");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 pb-16">
      {/* Header */}
      <div className="flex items-center p-2 border-b border-black bg-red-600 text-white fixed top-0 left-0 w-full z-50">
        <WestIcon className="w-8 h-8 ml-2" onClick={handleNavigateHome} />
        <FaUserCircle className="w-8 h-10 ml-2" />
        <div className="font-semibold text-center flex-grow">
          <p className="text-md text-start ps-2 mt-0">
            {loading ? "Loading..." : "Chat Room".toUpperCase()}
          </p>
          <p className="text-SM text-start ps-2">
            {typing && (
              <span className="text-sm">{userProfile?.name} Typing...</span>
            )}
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto px-2 pt-5 bg-gray-100">
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
                    mobileNumber === data._id ? "justify-end" : "justify-start"
                  }`}
                >
                  {mobileNumber !== data._id && (
                    <FaUserCircle className="w-5 h-8 mr-2" />
                  )}
                  <div
                    className={`p-2 max-w-[300px] rounded-lg ${
                      mobileNumber === data._id
                        ? "bg-red-600 text-white"
                        : "bg-white text-black"
                    } text-dark`}
                  >
                    <div className="flex flex-col">
                      {mobileNumber !== data.mobileNo && (
                        <span className="font-bold">{data.author}:</span>
                      )}
                      <span className="whitespace-pre-wrap">
                        {data.message}
                      </span>
                      <div className="text-xs">
                        {moment(data.createdAt).format("hh:mm A")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="fixed bottom-0 z-50 bg-slate-200 left-0 w-full p-2 border-t border-gray-300 flex items-center">
        <input
          ref={inputRef}
          type="text"
          onChange={handleInputChange}
          value={newMessage}
          placeholder="Type a message..."
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b54949] focus:border-transparent"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage(e);
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

      {error && <p className="text-red-600 p-2">{error}</p>}
    </div>
  );
};

export default dynamic(() => Promise.resolve(Chat), { ssr: false });
