import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../styles/main.scss';

// const API_URL = 'http://localhost:3001/api/chat';
const API_URL = 'https://backend-0lsa.onrender.com/api/chat';

function ChatInterface() {
  const [sessionId, setSessionId] = useState(() => {
    // Get session ID from local storage or create a new one
    let storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('sessionId', storedSessionId);
    }
    return storedSessionId;
  });

  // Initialize messages state with an empty array
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch chat history on component mount
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/${sessionId}`);
        const data = await response.json();
        if (data.history && Array.isArray(data.history)) {
          // Set messages only if the fetched data is an array
          setMessages(data.history);
        } else {
          // If data is not an array, initialize messages as an empty array
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        // On error, ensure messages is an empty array to prevent rendering issues
        setMessages([]);
      }
    };
    fetchHistory();
  }, [sessionId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.content, sessionId }),
      });

      const data = await response.json();
      const botMessage = { role: 'bot', content: data.response };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { role: 'bot', content: 'Sorry, something went wrong. Please try again.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSession = async () => {
    try {
      await fetch(`${API_URL}/${sessionId}`, { method: 'DELETE' });
      const newSessionId = uuidv4();
      localStorage.setItem('sessionId', newSessionId);
      setSessionId(newSessionId);
      setMessages([]);
    } catch (error) {
      console.error('Error resetting session:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        RAG News Chatbot
        <button onClick={handleResetSession}>Reset Session</button>
      </div>
      <div className="messages-list">
        {/* The conditional check is crucial here */}
        {Array.isArray(messages) && messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="message bot">Thinking...</div>}
      </div>
      <form onSubmit={handleSendMessage} className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about the news..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}

export default ChatInterface;