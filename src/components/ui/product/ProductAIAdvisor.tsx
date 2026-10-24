"use client";

import React, { useState } from "react";
import { Sparkles, ChevronRight, X, Bot, Send, CheckCircle2 } from "lucide-react";

interface ProductAIAdvisorProps {
  productTitle?: string;
  categoryName?: string;
}

export const ProductAIAdvisor: React.FC<ProductAIAdvisorProps> = ({
  productTitle = "this product",
  categoryName = "General",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: `Hello! I am your Amarzone AI Advisor. How can I help you evaluate "${productTitle}" today?`,
    },
  ]);

  const presetQuestions = [
    "What are the key specifications and features of this item?",
    "Is this item eligible for Amarzone fast delivery and returns?",
    "How does this item compare with others in this category?",
    "Are all listed variants authentic and verified?",
  ];

  const handlePresetClick = (q: string) => {
    setChatQuery(q);
    handleSend(q);
  };

  const handleSend = (text?: string) => {
    const query = text || chatQuery;
    if (!query.trim()) return;

    const userMsg = query.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatQuery("");

    setTimeout(() => {
      let aiResponse = `"${productTitle}" is a verified item in the ${categoryName} department. All orders fulfilled through Amarzone are protected under our A-to-z buyer guarantee with authentic vendor verification.`;

      if (userMsg.toLowerCase().includes("deliver") || userMsg.toLowerCase().includes("ship")) {
        aiResponse =
          "Fast fulfillment is available for in-stock inventory with tracking provided upon dispatch.";
      } else if (userMsg.toLowerCase().includes("return") || userMsg.toLowerCase().includes("guarantee")) {
        aiResponse =
          "This purchase is covered by standard 30-day returns and Amarzone buyer protection guarantees.";
      } else if (userMsg.toLowerCase().includes("compare") || userMsg.toLowerCase().includes("category")) {
        aiResponse =
          `Compared to similar options in ${categoryName}, this listing features verified seller sourcing and direct customer support.`;
      }

      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
    }, 600);
  };

  return (
    <>
      {/* AI Advisor Card matching screenshot */}
      <div className="bg-[#131127] border border-violet-900/40 rounded-2xl p-4 text-white shadow-md space-y-3.5 select-none mt-4">
        {/* Top Header */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5 fill-amber-400/30" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-tight">
                Amarzone AI Advisor
              </span>
              <span className="bg-[#ffd814] text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                Instant
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Have questions about this item?
            </p>
          </div>
        </div>

        {/* Primary AI CTA */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-gradient-to-r from-[#ffa41c] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#ea580c] text-slate-950 font-bold text-xs py-2.5 px-3.5 rounded-xl flex items-center justify-between shadow-sm cursor-pointer transition-all active:scale-[0.99]"
        >
          <span>Ask AI About This Product</span>
          <Sparkles className="w-4 h-4 text-slate-950" />
        </button>

        {/* Compare with Alternatives */}
        <button
          type="button"
          onClick={() => setIsCompareOpen(true)}
          className="w-full bg-white/10 hover:bg-white/15 text-slate-200 text-xs py-2 px-3.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
        >
          <span className="font-normal text-xs text-slate-300">
            Compare with Alternatives
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* AI Assistant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#131127] border border-violet-800/50 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-violet-800/40 bg-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Amarzone AI Advisor
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
                    {productTitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "ai" && (
                    <div className="w-6 h-6 rounded-full bg-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-xl max-w-[82%] leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#ffa41c] text-slate-950 font-medium rounded-tr-none"
                        : "bg-white/10 text-slate-200 border border-white/10 rounded-tl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Preset suggestion chips */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-1.5">
                  Suggested questions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presetQuestions.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePresetClick(q)}
                      className="bg-white/5 hover:bg-white/15 text-slate-300 text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-left cursor-pointer transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Input Footer */}
            <div className="p-3 border-t border-violet-800/40 bg-white/5 flex items-center gap-2">
              <input
                type="text"
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything about specs, compatibility, durability..."
                className="flex-1 bg-black/40 border border-violet-700/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                className="bg-[#ffa41c] hover:bg-[#f59e0b] text-slate-950 p-2 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#131127] border border-violet-800/50 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-violet-800/40 bg-white/5">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Product Comparison Analysis</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCompareOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 border-b border-white/10 pb-3 font-semibold text-slate-300">
                <span>Features</span>
                <span className="text-amber-400">DWEII 4 PCS (This Item)</span>
                <span>Anker Mini Sound</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-slate-400 border-b border-white/5 pb-2">
                <span className="text-slate-300">Price</span>
                <span className="font-bold text-white">$28.79 (Pack of 4)</span>
                <span>$34.99 (Pack of 1)</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-slate-400 border-b border-white/5 pb-2">
                <span className="text-slate-300">Impedance</span>
                <span className="text-white">8 Ohm / 1 Watt</span>
                <span>4 Ohm / 3 Watt</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-slate-400 border-b border-white/5 pb-2">
                <span className="text-slate-300">Connector</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> JST-PH1.25mm
                </span>
                <span>USB-C Only</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-slate-400">
                <span className="text-slate-300">Best For</span>
                <span className="text-white">Cavity / DIY / Advertising</span>
                <span>Casual Phone Audio</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductAIAdvisor;
