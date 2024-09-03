import { showChatMessage } from "API/api";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("https://daily-expense-api.onrender.com", {
  transports: ["websocket"],
});

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<any>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await showChatMessage();
        console.log("response", response);
        if (response) {
          setMessages(response);
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.emit("join_room", "room1");

    socket.on("receive_message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("send_message", {
        author: "User",
        message,
        room: "room1",
      });
      setMessage("");
    }
  };

  return (
    <div className="pt-10 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Chat Room</h2>
      <div
        className="bg-gray-200 p-4 rounded-lg overflow-y-auto h-64 mb-4"
        style={{ maxHeight: "300px" }}
      >
        {messages &&
          messages.map((msg, index) => (
            <p key={index} className="mb-2">
              <strong>{msg.author}:</strong> {msg.message}
            </p>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
