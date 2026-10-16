```jsx
import { useEffect, useRef, useState } from "react";
import "./Chat.css";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://paddips-bot.onrender.com"
).replace(/\/+$/, "");

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text = message) {
    const prompt = text.trim();
    if (!prompt || loading) return;

    setMessages((previous) => [
      ...previous,
      { type: "user", text: prompt },
    ]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `Server error ${response.status}`);
      }

      if (!data.reply) {
        throw new Error("The AI returned an empty response.");
      }

      setMessages((previous) => [
        ...previous,
        { type: "ai", text: data.reply },
      ]);
    } catch (error) {
      console.error("PADDIPS chat error:", error);

      setMessages((previous) => [
        ...previous,
        {
          type: "error",
          text: `${error.message || "Unable to connect."} Check your backend URL and server.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <div className="chat-widget">
      <div className="chat-widget-header">
        <div className="chat-bot-avatar">🤖</div>
        <div>
          <strong>PADDIPS BOT</strong>
          <p>Your friendly study assistant</p>
        </div>
        <button
          className="clear-chat"
          onClick={() => setMessages([])}
          type="button"
        >
          Clear chat
        </button>
      </div>

      <div className="chat-widget-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <span>✨</span>
            <h2>Hi! What are we learning today?</h2>
            <p>Ask in English or Tamil-English Tanglish.</p>
            <div className="chat-suggestions">
              {[
                "Explain cloud computing simply",
                "Teach me Python from zero",
                "Help me prepare for interviews",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={loading}
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt} →
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((item, index) => (
          <div className={`chat-message ${item.type}`} key={index}>
            <div className="chat-message-label">
              {item.type === "user"
                ? "👤 You"
                : item.type === "error"
                ? "⚠️ Connection"
                : "🤖 PADDIPS BOT"}
            </div>
            <div className="chat-message-bubble">{item.text}</div>
          </div>
        ))}

        {loading && (
          <div className="chat-message ai">
            <div className="chat-message-label">🤖 PADDIPS BOT</div>
            <div className="chat-message-bubble typing-indicator">
              Thinking<span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form className="chat-widget-input" onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask your study question..."
          aria-label="Ask your study question"
          disabled={loading}
        />
        <button disabled={loading || !message.trim()} type="submit">
          {loading ? "..." : "Send ➤"}
        </button>
      </form>
      <p className="chat-widget-footer">
        Learn at your own pace · PADDIPS BOT
      </p>
    </div>
  );
}

export default Chat;
```
