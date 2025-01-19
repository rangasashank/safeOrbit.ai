import React, { useEffect, useState, useRef } from 'react';
import ChatbotIcon from '../components/ChatbotIcon';
import ChatForm from '../components/ChatForm';
import ChatMessage from '../components/ChatMessage';
import '../components/Chatbot.css';
import useUserLocation from '../hooks/useUserLocation';




const Chat = ({disasters}) => {
  const chatBodyRef = useRef();
  const location = useUserLocation();
  const [showChatbot, setShowChatbot] = useState(false);
  const companyInfo = `You are an emergency assistance chatbot designed to provide real-time support to individuals during disaster situations. You are empathetic, clear, and concise in your responses.

  The user's current location has already been shared with you, and you can use it to provide information such as:
  1. The nearest shelters or evacuation centers.
  2. Emergency contact numbers (local and national).
  3. The nearest medical facilities or resources.
  4. Real-time updates about the disaster (e.g., weather updates, road closures).
  5. Steps for personal safety during the specific type of disaster.
  
  Your responses should be personalized, offering actionable advice based on the user's location. If you do not have precise information, guide the user to trusted external resources or helplines.
  
  **Example Situations:**
  1. If the user says, "I need a shelter," provide a list of nearby shelters.
  2. If the user says, "Where is the nearest hospital?" provide the closest hospital or medical resource based on their location.
  3. If the user asks, "What should I do during a wildfire?" give them safety instructions tailored to wildfires.
  
  **Key Guidelines:**
  - Be empathetic and calm to reassure the user.
  - Ensure all suggestions are concise and easy to follow in an emergency.
  - If a critical resource is unavailable, direct the user to trusted helplines or local emergency services.
  
  **User Location Data:**
  - Latitude: ${location.latitude} 
  - Longitude: ${location.longitude}

  **Nearby Disastrous Events:**
  - ${disasters.map((disaster) => disaster.type).join("\n- ")}
  
  **Tone:**
  Always prioritize the user's safety and well-being, maintaining a calm and reassuring tone.
  
  Start by greeting the user and asking how you can assist them in their current emergency situation.`
  
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: companyInfo,
    },
  ]);


  const generateBotResponse = async (history) => {
    // Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [...prev.filter((msg) => msg.text != "Thinking..."), { role: "model", text, isError }]);
    };

    // Format chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      // Make the API call to get the bot's response
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error.message || "Something went wrong!");

      // Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    } catch (error) {
      // Update chat history with the error message
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    // Auto-scroll whenever chat history updates
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">AI HELP</span>
        <span className="material-symbols-rounded">close</span>
      </button>

      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
            X
          </button>
        </div>

        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>

          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
