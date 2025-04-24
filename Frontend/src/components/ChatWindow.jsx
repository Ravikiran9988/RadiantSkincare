import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000"); // Replace with your backend URL if deployed

const ChatWindow = ({ user }) => {
  const { consultationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("joinRoom", consultationId);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    fetchChatHistory();

    return () => {
      socket.emit("leaveRoom", consultationId);
      socket.off("receiveMessage");
    };
  }, [consultationId]);

  const fetchChatHistory = async () => {
    try {
      const res = await axios.get(`/api/chat/history/${consultationId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  };

  const sendMessage = () => {
    if (input.trim() === "") return;

    const messageData = {
      sender: user.username,
      text: input,
      consultationId,
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", messageData);
    setMessages((prev) => [...prev, messageData]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === user.username ? "message user" : "message doctor"}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
