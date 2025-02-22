import React, { useState, useEffect, useRef } from 'react';
import './AgentChat.css';

function AgentChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:4000'); // Replace with your URL

    ws.current.onopen = () => {
      console.log('Connected to AI Agent');
    };

    ws.current.onmessage = (event) => {
      setIsSending(false);
      try {
        const message = JSON.parse(event.data);
        console.log(message)
        setMessages((prevMessages) => [...prevMessages, { text: message.response , sender: 'agent' }]);
      } catch (error) {
        console.error('Error parsing agent message:', error);
        setMessages((prevMessages) => [...prevMessages, { text: event.data, sender: 'agent' }]);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from AI Agent');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ws.current && ws.current.readyState === WebSocket.OPEN && !isSending) {
      setIsSending(true);
      try {
        ws.current.send(JSON.stringify({ type: 'user_input', text: input }));
        setMessages((prevMessages) => [...prevMessages, { text: input, sender: 'user' }]);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
        setIsSending(false);
      }
    } else {
      if (isSending) {
        console.log("Please wait for the agent's response.");
      } else {
        console.error('WebSocket connection is not open.');
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <div className="message-content">{message.text}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isSending}
          className="chat-input"
        />
        <button type="submit" disabled={isSending} className="chat-send-button">
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default AgentChat;