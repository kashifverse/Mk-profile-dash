import { useState, useRef, useEffect } from "react";
import { ChatHistoryItem } from "../types";
import { 
  Send, 
  Sparkles, 
  Map, 
  HelpCircle, 
  Brain, 
  User, 
  Compass, 
  Terminal,
  X,
  Plus
} from "lucide-react";

export default function GeospatialCopilot() {
  const [messages, setMessages] = useState<ChatHistoryItem[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hi! I am MK Spatial's **Geospatial AI Copilot**. I assist visitors in interpreting remote sensing data, cartography methods, and browsing Mohammad Kashif's spatial analytics projects. \n\nWhat scientific concepts or portfolio layers would you like me to analyze for you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    "Identify coastal erosion methodology",
    "How does Landsat LST mapping work?",
    "Showcase Mohammad Kashif's Python stack",
    "Write SQL spatial queries in PostGIS"
  ];

  // Auto scroll down
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatHistoryItem = {
      id: `user-${Date.now()}`,
      role: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      // Build previous chat history context to pass to Gemini
      const chatHistory = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, chatHistory })
      });

      if (!res.ok) {
        throw new Error("Geospatial satellite link timed out.");
      }

      const data = await res.json();
      
      const copilotMsg: ChatHistoryItem = {
        id: `copilot-${Date.now()}`,
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatHistoryItem = {
        id: `err-${Date.now()}`,
        role: "model",
        text: "🚨 **Spatial Transmitting Timeout:** Failed to ping Gemini API context. Please verify that the `GEMINI_API_KEY` is fully declared in your Secrets drawer.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-outline-variant/30 overflow-hidden flex flex-col h-[520px]">
      
      {/* Copilot Header */}
      <div className="p-4 bg-surface-container-low border-b border-outline-variant/30 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="flex items-center gap-1.5 font-headline-lg text-sm text-on-surface font-semibold tracking-wider">
              Geospatial Copilot
              <span className="bg-primary/20 text-[#bdc2ff] text-[9px] font-mono-data font-medium uppercase px-1.5 py-0.5 rounded border border-[#7c87f3]/30">V2.5</span>
            </span>
            <p className="text-[10px] text-on-surface-variant">
              Ask about remote sensing datasets, coordinates, or cartography logic.
            </p>
          </div>
        </div>

        {/* Quick Diagnostic status pill */}
        <span className="font-mono-data text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
          <Terminal className="w-3 h-3" /> ONLINE
        </span>
      </div>

      {/* Messages stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-surface-container-lowest/20">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Avatar indicator */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isUser 
                  ? "bg-[#553b70] text-[#c7a9e6] border border-[#c7a9e6]/40" 
                  : "bg-primary/20 text-primary border border-primary/40"
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message text bubble */}
              <div className="space-y-1">
                <div 
                  className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                    isUser 
                      ? "bg-primary text-on-primary font-medium rounded-tr-none" 
                      : "bg-surface-container-high text-on-surface-variant border border-outline-variant/20 rounded-tl-none font-body-md"
                  }`}
                >
                  {/* Primitive Markdown-to-HTML parser for basic bold/italics elements rendering */}
                  <div className="whitespace-pre-line prose prose-invert font-sans prose-xs">
                    {msg.text.split("\n\n").map((para, pIdx) => {
                      return (
                        <p key={pIdx} className="mb-2 last:mb-0">
                          {para.split(" ").map((word, wIdx) => {
                            if (word.startsWith("**") && word.endsWith("**")) {
                              return <strong key={wIdx} className="text-on-surface font-semibold">{word.replaceAll("**", "")} </strong>;
                            }
                            if (word.startsWith("*") && word.endsWith("*")) {
                              return <em key={wIdx} className="italic text-primary">{word.replaceAll("*", "")} </em>;
                            }
                            return word + " ";
                          })}
                        </p>
                      );
                    })}
                  </div>
                </div>
                <div className={`text-[9px] text-outline font-mono-data ${isUser ? "text-right" : "text-left"}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading active feedback dots */}
        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-primary/25 border border-primary/40 flex items-center justify-center shrink-0 text-primary animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-surface-container-high border border-outline-variant/25 p-4 rounded-xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested quick chips */}
      <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0 select-none">
        {suggestionChips.map((chip, index) => (
          <button
            key={index}
            onClick={() => handleSend(chip)}
            className="px-3 py-1.5 bg-surface-container-lowest hover:bg-primary-container hover:text-on-primary-container text-[11px] font-mono-data font-medium text-primary rounded-full border border-outline-variant/30 flex items-center gap-1 whitespace-nowrap transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3 text-primary" /> {chip}
          </button>
        ))}
      </div>

      {/* Message Submit box */}
      <div className="p-3 bg-surface-container-low border-t border-outline-variant/30">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type a spatial inquiry (e.g. Landsat NDVI mapping Q)..."
            className="flex-1 bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-xs text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className={`p-2.5 rounded-lg border flex items-center justify-center transition-all ${
              inputVal.trim() && !isLoading
                ? "bg-primary text-on-primary border-primary hover:brightness-110 cursor-pointer active:scale-95"
                : "bg-surface-container-lowest text-outline border-outline-variant/30 pointer-events-none"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
