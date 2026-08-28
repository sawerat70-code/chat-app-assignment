import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";

const ChatThread = ({ selectedUser, currentUser, messages }) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    socket.emit("chat:send", { to: selectedUser._id, text });
    setText("");
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="avatar">
          {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div style={{ marginLeft: "0.75rem" }}>
          <div style={{ fontWeight: 600 }}>{selectedUser.name}</div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((m, idx) => {
          const isMe = m.sender === currentUser._id || m.sender === currentUser.id;
          const timeStr = new Date(m.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={m._id || idx}
              className={`message-bubble ${isMe ? "sent" : "received"}`}
            >
              <div>{m.text}</div>
              <div className="message-time">{timeStr}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="send-btn">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatThread;