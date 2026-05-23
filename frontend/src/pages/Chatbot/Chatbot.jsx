import { useEffect, useRef, useState } from "react";
import { useChatbotStore } from "../../store/useChatbotStore";
import { Send, Bot, User, Copy, Mic, MicOff } from "lucide-react";
import SidebarLayout from "../../components/layouts/SidebarLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Chatbot = () => {
  const { messages, fetchChat, sendMessage, loading } = useChatbotStore();

  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🎤 INIT SPEECH RECOGNITION
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setInput(transcript);
    };

    recognition.onerror = () => setListening(false);

    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <SidebarLayout>
      <div className="flex flex-col h-screen max-w-2xl mx-auto bg-base-200 rounded-box shadow-lg">

        {/* HEADER */}
        <div className="p-4 border-b flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary" />
          <h2 className="font-bold text-lg">AI Chatbot</h2>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-bubble max-w-full">

                <div className="flex items-start gap-2">
                  {msg.role === "bot" ? (
                    <Bot className="w-4 h-4 mt-1" />
                  ) : (
                    <User className="w-4 h-4 mt-1" />
                  )}

                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(msg.content)}
                  className="btn btn-xs btn-ghost mt-2"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
            </div>
          ))}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 border-t flex items-center gap-2">

          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Type or speak..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {/* 🎤 MIC BUTTON */}
          <button
            onClick={listening ? stopListening : startListening}
            className={`btn ${listening ? "btn-error" : "btn-outline"}`}
          >
            {listening ? <MicOff /> : <Mic />}
          </button>

          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* 🌊 WAVE ANIMATION */}
        {listening && (
          <div className="flex justify-center items-center gap-1 pb-3">
            <span className="wave" />
            <span className="wave" />
            <span className="wave" />
            <span className="wave" />
            <span className="wave" />
          </div>
        )}

        {/* CSS */}
        <style>{`
          .wave {
            width: 4px;
            height: 20px;
            background: #3b82f6;
            animation: wave 1s infinite ease-in-out;
            border-radius: 2px;
          }

          .wave:nth-child(2) { animation-delay: 0.1s; }
          .wave:nth-child(3) { animation-delay: 0.2s; }
          .wave:nth-child(4) { animation-delay: 0.3s; }
          .wave:nth-child(5) { animation-delay: 0.4s; }

          @keyframes wave {
            0%, 100% { transform: scaleY(0.3); }
            50% { transform: scaleY(1); }
          }
        `}</style>

      </div>
    </SidebarLayout>
  );
};

export default Chatbot;