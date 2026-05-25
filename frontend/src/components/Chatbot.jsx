import React, { useState } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';
import { API_BASE_URL } from '../config';
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
      const res = await axios.post(`${API_BASE_URL}/api/chat`, { message: input });
      setMessages(prev => [...prev, { text: res.data.response, isBot: true }]);
    } catch (err) {
      console.warn("Backend chat service offline. Using local intelligent helper.");
      
      const query = input.toLowerCase().trim();
      let reply = "I'm currently running in offline demo mode, but I'd love to help! Ask me about our products, delivery times, or discount codes.";
      
      if (query.includes('hi') || query.includes('hello') || query.includes('hey') || query.includes('greet')) {
        reply = "Hi there! Welcome to DairyMart! 🥛 I'm operating in Interactive Demo Mode since my backend is offline, but I can still help you explore our fresh items. How can I help you today?";
      } else if (query.includes('price') || query.includes('product') || query.includes('sell') || query.includes('shop') || query.includes('buy') || query.includes('item')) {
        reply = "We offer farm-fresh dairy products: Whole Milk (₹68), Cheddar Cheese (₹250), Greek Yogurt (₹180), Salted Butter (₹280), Paneer (₹120), and Desi Ghee (₹650). You can search for them and add them to your cart directly from the Shop page!";
      } else if (query.includes('delivery') || query.includes('ship') || query.includes('order')) {
        reply = "We deliver farm-fresh products directly to your doorstep in under 24 hours to ensure they stay perfectly cold and fresh!";
      } else if (query.includes('discount') || query.includes('offer') || query.includes('promo') || query.includes('coupon') || query.includes('deal')) {
        reply = "You can use coupon code **FRESH15** during checkout for an instant 15% off your first purchase! 🏷️";
      } else if (query.includes('pay') || query.includes('cash') || query.includes('card') || query.includes('upi')) {
        reply = "We support UPI, Netbanking, and Card payments in production. In this offline demo, you can complete checkout using Cash on Delivery (COD) to test the order system!";
      }
      
      setMessages(prev => [...prev, { text: reply, isBot: true }]);
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
