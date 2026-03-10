import React, { useState } from "react";
import "./LLMChat.css";

const LLMChat = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! How can I help you with your hotel booking?", sender: "bot" },
    ]);
    const [inputMessage, setInputMessage] = useState("");

    const sendMessage = async() => {
        if (!inputMessage.trim()) return;

        // Add user message
        setMessages([...messages, { text: inputMessage, sender: "user" }]);

        // Here you'll connect to your custom LLM API
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    text: "I'm your AI assistant. How can I help with your booking?",
                    sender: "bot",
                },
            ]);
        }, 1000);

        setInputMessage("");
    };

    return ( <
        div className = "llm-chat" >
        <
        div className = "chat-header" >
        <
        h3 > 🤖AI Assistant < /h3> <
        /div>

        <
        div className = "chat-messages" > {
            messages.map((msg, index) => ( <
                div key = { index }
                className = { `message ${msg.sender}` } > { msg.text } <
                /div>
            ))
        } <
        /div>

        <
        div className = "chat-input" >
        <
        input type = "text"
        value = { inputMessage }
        onChange = {
            (e) => setInputMessage(e.target.value) }
        placeholder = "Ask me anything..."
        onKeyDown = {
            (e) => e.key === "Enter" && sendMessage() }
        /> <
        button onClick = { sendMessage } > Send < /button> <
        /div> <
        /div>
    );
};

export default LLMChat;