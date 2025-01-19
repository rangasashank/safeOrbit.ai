import React from 'react';

const ChatMessage = ({ chat }) => {
  if (chat.hideInChat) return null;

  return (
    <div className={`message ${chat.role === 'model' ? 'bot-message' : 'user-message'}`}>
      <p className="message-text">{chat.text}</p>
    </div>
  );
};

export default ChatMessage;
