import { useState } from "react";

const API_URL = "http://localhost:5000";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const userMessage = message.trim();

    if (!userMessage || loading) return;

    setMessages((prev) => [
      ...prev,
      { type: "user", text: userMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Server error: ${response.status}`
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: data.reply || "Sorry, I could not generate a response.",
        },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: `❌ ${error.message || "Unable to connect to the backend."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#222",
      }}
    >
      <h1>🤖 AI Study Assistant</h1>
      <p>Ask me anything about your studies.</p>

      <div
        style={{
          minHeight: "350px",
          maxHeight: "500px",
          overflowY: "auto",
          padding: "20px",
          marginTop: "20px",
          background: "#f5f5f5",
          borderRadius: "15px",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "100px 10px",
              color: "#777",
            }}
          >
            👋 Ask me a question to get started!
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "15px",
              padding: "12px",
              background: msg.type === "user" ? "#ddd5ff" : "#fff",
              borderRadius: "10px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            <strong>{msg.type === "user" ? "You" : "AI"}:</strong>{" "}
            {msg.text}
          </div>
        ))}

        {loading && (
          <div
            style={{
              padding: "12px",
              background: "#fff",
              borderRadius: "10px",
              color: "#666",
            }}
          >
            <strong>AI:</strong> Thinking... 🤔
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your study question..."
          disabled={loading}
          style={{
            flex: 1,
            minWidth: 0,
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        <button
          type="button"
          onClick={sendMessage}
          disabled={loading || !message.trim()}
          style={{
            padding: "14px 24px",
            border: "none",
            borderRadius: "10px",
            background: "#5b3cc4",
            color: "#fff",
            fontSize: "16px",
            cursor: loading || !message.trim() ? "not-allowed" : "pointer",
            opacity: loading || !message.trim() ? 0.6 : 1,
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chat;