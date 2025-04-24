import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './ChatPage.css';

// Socket connection
const socket = io('http://localhost:5000');

const ChatPage = () => {
  const { consultationId } = useParams(); // Get the consultation ID from URL params
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Test'); // Replace with actual doctor data

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('doctorToken');
        const res = await fetch(`http://localhost:5000/api/consultation/${consultationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data.messages);
        setPatientName(data.patientName); // Assuming this is returned from API
        setLoading(false);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    socket.emit('join-room', consultationId);

    socket.on('new-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('new-message');
      socket.emit('leave-room', consultationId);
    };
  }, [consultationId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        sender: 'doctor',
        content: newMessage,
        time: new Date().toLocaleString(),
      };

      socket.emit('send-message', { consultationId, message });

      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    }
  };

  if (loading) return <div className="loading">Loading chat...</div>;

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Chat with {patientName}</h1>
      </header>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.content}</p>
            <span>{msg.time}</span>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
