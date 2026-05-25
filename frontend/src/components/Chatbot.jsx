import React, { useState } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm the Dairy Mart assistant. How can I help you?", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/chat', { message: input });
      setMessages(prev => [...prev, { text: res.data.response, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the server.", isBot: true }]);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window glass animate-fade-in">
          <div className="chatbot-header">
            <h3>Dairy Assistant</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.isBot ? 'bot' : 'user'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          
          <form className="chatbot-input" onSubmit={sendMessage}>
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button className="chatbot-toggle btn-primary" onClick={() => setIsOpen(true)}>
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
