import React, { useState, FC } from "react";

const Chat: FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 fixed top-0 left-0 right-0">
        <h1 className="text-lg font-semibold">Chat</h1>
      </header>

      {/* Messages */}
      <main
        className="flex-1 overflow-y-auto p-4 pt-16"
        style={{ height: `calc(100vh - 112px)` }}
      >
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg ${
                idx % 2 === 0 ? "bg-gray-200" : "bg-green-200"
              } text-gray-900`}
            >
              {msg}
            </div>
          ))}
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t mb-3  border-gray-300 fixed bottom-12 left-0 right-0">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
