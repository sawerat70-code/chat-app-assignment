import React, { useState, useEffect, useRef } from "react";

const ChatThread = ({ me, other, messages, onSend }) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="main">
      <div className="main-head">
        <div className="avatar">{other.name?.charAt(0).toUpperCase()}</div>
        <div className="chat-header-info">
          <h3>{other.name}</h3>
        </div>
      </div>

      <div className="body">
        {messages.map((m, idx) => {
          const isMe = m.sender === me._id || m.sender === me.id;
          const timeStr = new Date(m.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={m._id || idx} className={`bubble ${isMe ? "out" : "in"}`}>
              <div>{m.text}</div>
              <div className="stamp">{timeStr}
                {isMe && (
                  <span className={`ticks ${m.read ? "read": ""}`}>
                    {m.read ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="foot" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="send">Send</button>
      </form>
    </div>
  );
};

export default ChatThread;