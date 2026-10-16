
import { useState, useEffect, useRef } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

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

      if (!data.reply) {
        throw new Error("The backend returned an empty reply.");
      }

      setMessages((prev) => [
        ...prev,
        { type: "ai", text: data.reply },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);

      let errorMessage = error.message;

      if (
        error instanceof TypeError ||
        error.name === "NetworkError"
      ) {
        errorMessage =
          "Cannot connect to the backend. Check your server URL and internet connection.";
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          text: `❌ ${errorMessage || "Unable to connect to the backend."}`,
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
    <div className="chat-page">
      <div className="chat-card">
        <header className="chat-header">
          <div className="chat-avatar">🤖</div>
          <div>
            <h1>PADDIPS BOT</h1>
            <p>AI Learning Assistant</p>
          </div>
          <span className="online-status">● Ready</span>
        </header>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-welcome">
              <div className="welcome-icon">✨</div>
              <h2>Hello, Learner!</h2>
              <p>
                Ask me questions about programming, science,
                mathematics, or your studies.
              </p>

              <div className="suggestion-list">
                {[
                  "Explain Python basics",
                  "What is cloud computing?",
                  "Give me a Java program",
                ].map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => setMessage(question)}
                  >
                    {question} →
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={`${index}-${msg.type}`}
              className={`message-row ${msg.type}`}
            >
              <div className="message-avatar">
                {msg.type === "user"
                  ? "👤"
                  : msg.type === "error"
                  ? "⚠️"
                  : "🤖"}
              </div>

              <div className="message-content">
                <span className="message-sender">
                  {msg.type === "user"
                    ? "You"
                    : msg.type === "error"
                    ? "Connection Error"
                    : "PADDIPS BOT"}
                </span>

                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row ai">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <span className="message-sender">
                  PADDIPS BOT
                </span>
                <div className="message-bubble typing">
                  Thinking
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <form
          className="chat-input-area"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your studies..."
            disabled={loading}
            aria-label="Your message"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
          >
            {loading ? "..." : "➤"}
          </button>
        </form>

        <p className="chat-footer">
          Your AI learning companion · PADDIPS BOT
        </p>
      </div>
    </div>
  );
}

export default Chat;

