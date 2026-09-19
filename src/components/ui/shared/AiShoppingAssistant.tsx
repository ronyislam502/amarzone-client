"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Trash2,
  Minimize2,
  Maximize2,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  ShoppingBag,
  Sliders,
  DollarSign,
  Tag,
  Check,
  AlertCircle,
  ArrowRight,
  Bot,
  User,
  Zap,
} from "lucide-react";
import {
  useChatShoppingAssistantMutation,
  TShoppingAssistantOutput,
  TProductComparisonItem,
} from "@/redux/features/ai/aiApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export interface AiShoppingAssistantProps {
  initialProductId?: string;
  initialProductTitle?: string;
  initialCategory?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  meta?: TShoppingAssistantOutput;
}

const DEFAULT_SUGGESTIONS = [
  "🔥 What are the best trending deals right now?",
  "🎧 Compare Sony vs Bose noise-cancelling headphones",
  "💻 Best lightweight laptops for productivity",
  "🎁 Gift ideas under $50 with high customer ratings",
];

export const AiShoppingAssistant: React.FC<AiShoppingAssistantProps> = ({
  initialProductId,
  initialProductTitle,
  initialCategory,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Active context state
  const [currentProductId, setCurrentProductId] = useState<string | undefined>(
    initialProductId
  );
  const [currentProductTitle, setCurrentProductTitle] = useState<
    string | undefined
  >(initialProductTitle);
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(
    initialCategory
  );

  const [chatShoppingAssistant, { isLoading: isThinking }] =
    useChatShoppingAssistantMutation();

  // Listen for custom global event to open AI assistant with product context
  useEffect(() => {
    const handleOpenAiAssistant = (e: CustomEvent) => {
      const { productId, productTitle, category, seedQuery } = e.detail || {};
      if (productId) setCurrentProductId(productId);
      if (productTitle) setCurrentProductTitle(productTitle);
      if (category) setCurrentCategory(category);
      setIsOpen(true);
      setIsMinimized(false);

      if (seedQuery) {
        setTimeout(() => {
          sendMessage(seedQuery, {
            currentProductId: productId,
            category,
          });
        }, 100);
      }
    };

    window.addEventListener(
      "open-ai-shopping-assistant" as any,
      handleOpenAiAssistant as any
    );
    return () => {
      window.removeEventListener(
        "open-ai-shopping-assistant" as any,
        handleOpenAiAssistant as any
      );
    };
  }, []);

  // Sync props if changed
  useEffect(() => {
    if (initialProductId) setCurrentProductId(initialProductId);
    if (initialProductTitle) setCurrentProductTitle(initialProductTitle);
    if (initialCategory) setCurrentCategory(initialCategory);
  }, [initialProductId, initialProductTitle, initialCategory]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, isThinking]);

  // Auto-focus input when window is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, isMinimized]);

  const clearChat = () => {
    setMessages([]);
    toast.info("Conversation cleared", { autoClose: 1000 });
  };

  const sendMessage = async (
    textToSend: string,
    overrideContext?: { currentProductId?: string; category?: string }
  ) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isThinking) return;

    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessageId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMessageId,
        role: "user",
        content: trimmed,
        timestamp: timeStr,
      },
    ];

    setMessages(newMessages);
    setInputMessage("");

    // Prepare history payload (last 10 turns)
    const chatHistory = newMessages.slice(-10).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const targetProductId = overrideContext?.currentProductId || currentProductId;
    const targetCategory = overrideContext?.category || currentCategory;

    const payload = {
      message: trimmed,
      chatHistory,
      context: {
        currentProductId: targetProductId,
        category: targetCategory,
      },
    };

    try {
      const response = await chatShoppingAssistant(payload).unwrap();
      if (response?.data) {
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: response.data.reply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          meta: response.data,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Shopping assistant encountered a temporary issue."
      );
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  // Render text with basic bolding and line breaks
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lIdx) => {
      // Split by bold markdown **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={lIdx} className={lIdx > 0 ? "mt-1.5 leading-relaxed" : "leading-relaxed"}>
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="font-bold text-amber-300">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith("- ") || part.startsWith("• ")) {
              return (
                <span key={pIdx} className="inline-flex items-start gap-1">
                  <span className="text-amber-400">•</span>
                  <span>{part.slice(2)}</span>
                </span>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* 1. FLOATING LAUNCHER BUTTON */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-bounce-subtle">
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex items-center gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-4 py-3.5 rounded-full shadow-[0_12px_35px_-5px_rgba(245,158,11,0.5)] border border-amber-300/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Open AI Shopping Assistant"
          >
            {/* Glowing ring pulse */}
            <span className="absolute -inset-1 rounded-full bg-amber-400/30 blur-md animate-pulse pointer-events-none" />

            <div className="relative p-1.5 rounded-full bg-slate-950 text-amber-400 shadow">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>

            <div className="text-left relative">
              <div className="text-xs font-black tracking-tight leading-none uppercase">
                Ask Amarzone AI
              </div>
              <div className="text-[10px] font-semibold text-slate-900/80 leading-tight">
                {currentProductTitle ? "Product Advice" : "Smart Shopping Guide"}
              </div>
            </div>

            {/* Notification Badge */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </button>
        </div>
      )}

      {/* 2. CONVERSATIONAL WINDOW */}
      {isOpen && (
        <div
          className={`fixed bottom-5 right-4 sm:right-6 z-50 transition-all duration-300 flex flex-col rounded-3xl overflow-hidden shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)] border border-amber-400/30 bg-[#140b2b] text-slate-100 ${
            isMinimized
              ? "w-[320px] h-[64px]"
              : "w-[94vw] sm:w-[460px] h-[630px] max-h-[88vh]"
          }`}
        >
          {/* Top glowing accent border line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none z-30" />

          {/* Ambient background glow orbs */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Window Header */}
          <div className="p-3.5 sm:p-4 bg-[#180f33] border-b border-white/10 flex items-center justify-between relative z-20 shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-md">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#180f33]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white tracking-tight">
                    Amarzone <span className="text-amber-400">AI Assistant</span>
                  </h3>
                  <span className="badge badge-warning text-[9px] font-black px-1.5 py-0 text-slate-950">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                  {currentProductTitle
                    ? `Context: ${currentProductTitle}`
                    : "Shopping, deals & comparisons"}
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                title="Clear conversation"
                className="btn btn-ghost btn-xs btn-circle text-slate-400 hover:text-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                title={isMinimized ? "Maximize" : "Minimize"}
                className="btn btn-ghost btn-xs btn-circle text-slate-400 hover:text-white"
              >
                {isMinimized ? (
                  <Maximize2 className="w-3.5 h-3.5" />
                ) : (
                  <Minimize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="btn btn-ghost btn-xs btn-circle text-slate-400 hover:text-rose-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body & Messages Stream (hidden when minimized) */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 text-xs">
                {/* Welcome Greeting & Seed Suggestions */}
                {messages.length === 0 && (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 rounded-2xl bg-[#1d123d]/70 border border-white/10 text-center space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mb-1">
                        <Bot className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-black text-white">
                        How can I help your shopping today?
                      </h4>
                      <p className="text-xs text-slate-300/80 leading-relaxed max-w-xs mx-auto">
                        Ask for top deals, compare two products, evaluate specifications, or narrow down by budget.
                      </p>
                      {currentProductTitle && (
                        <div className="pt-2">
                          <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-semibold flex items-center gap-1.5 justify-center">
                            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">
                              Active Product: {currentProductTitle}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick suggestion buttons */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
                        Try asking:
                      </span>
                      <div className="space-y-1.5">
                        {DEFAULT_SUGGESTIONS.map((sug, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => sendMessage(sug)}
                            className="w-full text-left p-2.5 rounded-xl bg-[#190f36] hover:bg-[#201444] border border-white/10 hover:border-amber-400/40 text-xs text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <span className="line-clamp-1">{sug}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0 ml-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Stream */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    } space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                      {msg.role === "user" ? (
                        <>
                          <span>You</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-amber-400 font-bold">
                            Amarzone AI
                          </span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`p-3.5 rounded-2xl max-w-[90%] sm:max-w-[85%] text-xs shadow-md leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-medium rounded-br-none"
                          : "bg-[#1c113b] border border-white/10 text-slate-100 rounded-bl-none space-y-3"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p>{msg.content}</p>
                      ) : (
                        <div className="space-y-3">
                          {/* Main reply text */}
                          <div>{renderFormattedText(msg.content)}</div>

                          {/* Render Side-by-Side Product Comparison Cards if provided */}
                          {msg.meta?.comparisons &&
                            msg.meta.comparisons.length > 0 && (
                              <div className="space-y-2 pt-1 border-t border-white/10">
                                <div className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                                  <Sliders className="w-3 h-3" />
                                  <span>Comparison Matrix</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                  {msg.meta.comparisons.map((comp, cIdx) => (
                                    <div
                                      key={cIdx}
                                      className="p-3 rounded-xl bg-[#120824] border border-white/10 space-y-2"
                                    >
                                      <div className="font-bold text-white text-xs flex items-center justify-between">
                                        <span>{comp.item}</span>
                                        <span className="badge badge-warning badge-xs font-black text-slate-950">
                                          Option {cIdx + 1}
                                        </span>
                                      </div>

                                      {/* Pros */}
                                      {comp.pros && comp.pros.length > 0 && (
                                        <div className="space-y-1 text-[11px]">
                                          <div className="text-emerald-400 font-semibold flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            <span>Pros</span>
                                          </div>
                                          <ul className="list-disc list-inside text-slate-300 pl-1 space-y-0.5">
                                            {comp.pros.map((p, pI) => (
                                              <li key={pI}>{p}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Cons */}
                                      {comp.cons && comp.cons.length > 0 && (
                                        <div className="space-y-1 text-[11px]">
                                          <div className="text-rose-400 font-semibold flex items-center gap-1">
                                            <X className="w-3 h-3" />
                                            <span>Cons</span>
                                          </div>
                                          <ul className="list-disc list-inside text-slate-300 pl-1 space-y-0.5">
                                            {comp.cons.map((c, cI) => (
                                              <li key={cI}>{c}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Verdict */}
                                      {comp.verdict && (
                                        <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20 text-[11px] text-amber-300 font-medium">
                                          <strong>Verdict:</strong> {comp.verdict}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Extracted Criteria & Search Action Card */}
                          {msg.meta?.extractedCriteria && (
                            <div className="p-2.5 rounded-xl bg-[#120824]/80 border border-white/10 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Detected Criteria
                                </span>
                                {msg.meta.extractedCriteria.maxPrice && (
                                  <span className="badge badge-success badge-sm font-bold text-[10px]">
                                    Max ${msg.meta.extractedCriteria.maxPrice}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {msg.meta.extractedCriteria.category && (
                                  <span className="badge badge-xs bg-sky-400/10 text-sky-400 border border-sky-400/30">
                                    {msg.meta.extractedCriteria.category}
                                  </span>
                                )}
                                {(msg.meta.extractedCriteria.keywords || []).map(
                                  (kw, ki) => (
                                    <span
                                      key={ki}
                                      className="badge badge-xs bg-white/5 text-slate-300 border border-white/10"
                                    >
                                      {kw}
                                    </span>
                                  )
                                )}
                              </div>
                              {/* 1-Click Search link */}
                              <Link
                                href={`/products?search=${encodeURIComponent(
                                  msg.meta.extractedCriteria.category ||
                                    msg.meta.extractedCriteria.keywords?.[0] ||
                                    ""
                                )}`}
                                onClick={() => setIsOpen(false)}
                                className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] transition-colors mt-1"
                              >
                                <span>Browse Matching Products in Catalog</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          )}

                          {/* Interactive Suggestions Chips */}
                          {msg.meta?.suggestions &&
                            msg.meta.suggestions.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                <span className="text-[10px] text-slate-400 font-semibold block">
                                  Suggested next steps:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {msg.meta.suggestions.map((sug, sIdx) => (
                                    <button
                                      key={sIdx}
                                      type="button"
                                      onClick={() => sendMessage(sug)}
                                      className="text-[11px] bg-[#120824] hover:bg-amber-400/10 hover:text-amber-300 border border-white/10 hover:border-amber-400/30 text-slate-300 py-1 px-2.5 rounded-lg transition-all text-left cursor-pointer"
                                    >
                                      {sug}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Thinking / Loading State */}
                {isThinking && (
                  <div className="flex items-start gap-2 text-xs">
                    <div className="w-7 h-7 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                    </div>
                    <div className="p-3 rounded-2xl bg-[#1c113b] border border-white/10 text-slate-300 rounded-bl-none flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span className="text-slate-300 text-xs font-medium">
                        Analyzing catalog &amp; specifications...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Form Footer */}
              <div className="p-3 sm:p-4 bg-[#180f33] border-t border-white/10 relative z-20 shrink-0">
                <form
                  onSubmit={handleFormSubmit}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about products, specs, deals..."
                    disabled={isThinking}
                    className="input input-sm flex-1 bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs py-2"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isThinking}
                    className="btn btn-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black border-0 rounded-xl px-3.5 shadow-md shadow-amber-500/20 disabled:opacity-40 cursor-pointer transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 px-1">
                  <span>Press Enter to send</span>
                  <span className="flex items-center gap-1 text-amber-400/70">
                    <Zap className="w-3 h-3" />
                    <span>Real-time AI Intelligence</span>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AiShoppingAssistant;
