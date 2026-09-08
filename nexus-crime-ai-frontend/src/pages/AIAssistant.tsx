import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Bot,
  Send,
  Network,
  Wallet,
  ShieldAlert,
  User,
} from "lucide-react";

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
};

function AIAssistant() {
  const location = useLocation();

  const selectedEntity = location.state?.entity || null;

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hello Investigator. I am the NEXUS-CRIME AI investigation assistant. Ask me about criminal networks, suspicious wallets, entities, or threat activity.",
    },
  ]);

  const suggestedQueries = [
    "Analyze Person A's criminal network",
    "Find suspicious wallet connections",
    "Explain the highest risk entity",
    "Summarize recent suspicious activity",
  ];

  const generateResponse = (question: string) => {
    const text = question.toLowerCase();

    if (text.includes("person a")) {
      return "Person A is currently classified as HIGH risk. The entity has 5 network connections and is associated with 3 investigation cases. Connected entities include Wallet A, Person B, and Device A.";
    }

    if (text.includes("wallet")) {
      return "Wallet A is classified as HIGH risk. The network indicates connections with Person A and suspicious transaction activity. Further blockchain analysis is recommended.";
    }

    if (
      text.includes("highest risk") ||
      text.includes("risk entity")
    ) {
      return "The current highest-risk entities are Person A and Wallet A. Both are classified as HIGH risk and have multiple relationships within the investigation network.";
    }

    if (
      text.includes("suspicious") ||
      text.includes("activity")
    ) {
      return "Recent intelligence indicates suspicious wallet activity, criminal network expansion, and unusual entity connections. These events should be prioritized for investigation.";
    }

    if (selectedEntity) {
      return `Analysis for ${selectedEntity}: this entity should be investigated using its network relationships, associated cases, risk level, and connected financial or device activity.`;
    }

    return "Based on the available mock intelligence, I recommend investigating high-risk entities first, then tracing their wallet, device, and person relationships.";
  };

  const sendMessage = (messageText?: string) => {
    const question = (messageText || input).trim();

    if (!question) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setTimeout(() => {
      const response: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: generateResponse(question),
      };

      setMessages((prev) => [...prev, response]);
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Bot className="text-cyan-400" size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              AI Investigation Assistant
            </h1>

            <p className="text-slate-400 mt-1">
              AI-powered criminal intelligence analysis
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-2 rounded-lg text-xs">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          AI Investigation Engine Online
        </div>

        <div className="bg-slate-900 border border-slate-800 text-slate-400 px-3 py-2 rounded-lg text-xs">
          Mock Intelligence Mode
        </div>
      </div>

      {/* Investigation Target */}
      {selectedEntity && (
        <div className="mb-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <User
                  size={21}
                  className="text-cyan-400"
                />
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Investigation Target
                </p>

                <p className="text-lg font-semibold text-cyan-400 mt-1">
                  {selectedEntity}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Network investigation context loaded
                </p>
              </div>
            </div>

            <Bot
              size={25}
              className="text-cyan-400"
            />

          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">

          {/* Suggested Queries */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

            <h2 className="text-sm font-semibold mb-4">
              Suggested Investigations
            </h2>

            <div className="space-y-2">
              {suggestedQueries.map((query) => (
                <button
                  key={query}
                  onClick={() => sendMessage(query)}
                  className="w-full text-left text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-lg p-3 hover:border-cyan-500/40 hover:text-cyan-400 transition"
                >
                  {query}
                </button>
              ))}
            </div>

          </div>

          {/* Capabilities */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

            <h2 className="text-sm font-semibold mb-4">
              AI Capabilities
            </h2>

            <div className="space-y-3">

              <div className="flex items-center gap-3">
                <Network
                  size={17}
                  className="text-cyan-400"
                />
                <span className="text-xs text-slate-400">
                  Network Analysis
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Wallet
                  size={17}
                  className="text-violet-400"
                />
                <span className="text-xs text-slate-400">
                  Wallet Investigation
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldAlert
                  size={17}
                  className="text-red-400"
                />
                <span className="text-xs text-slate-400">
                  Threat Detection
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Chat */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col min-h-[620px]">

          {/* Chat Header */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">

            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Bot
                size={19}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                NEXUS AI
              </h2>

              <p className="text-xs text-green-400">
                Ready for investigation
              </p>
            </div>

          </div>

          {/* Messages */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                    message.sender === "user"
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-950 border border-slate-800 text-slate-300"
                  }`}
                >
                  {message.text}
                </div>

              </div>
            ))}

          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-800">

            <div className="flex gap-3">

              <input
                type="text"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Ask AI about an entity, wallet, network..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
              />

              <button
                onClick={() => sendMessage()}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 rounded-lg flex items-center gap-2 font-semibold"
              >
                <Send size={17} />
                Send
              </button>

            </div>

            <p className="text-[10px] text-slate-600 mt-3">
              Demo mode: responses are generated from mock
              investigation intelligence.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AIAssistant;