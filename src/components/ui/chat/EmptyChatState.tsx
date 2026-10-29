"use client";

import React from "react";
import { MessageSquare, ShieldCheck, Sparkles, Zap } from "lucide-react";

interface EmptyChatStateProps {
  onStartNew?: () => void;
}

export const EmptyChatState: React.FC<EmptyChatStateProps> = ({ onStartNew }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#120824]/90 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-primary/20 to-indigo-600/10 flex items-center justify-center border border-white/15 shadow-lg shadow-amber-500/5">
          <MessageSquare className="w-10 h-10 text-amber-400 animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-[#170d2f] border border-white/15 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
        Your Messages & Live Chat
      </h3>
      <p className="text-sm text-slate-300/80 max-w-md mb-6 leading-relaxed">
        Select a conversation from the list to view chat history, or start a new
        conversation to contact vendors, customers, or 24/7 Amarzone support.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg w-full mb-8 text-left">
        <div className="p-3.5 rounded-xl bg-[#170d2f] border border-white/10 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <Zap className="w-3.5 h-3.5" /> Real-Time
          </div>
          <p className="text-xs text-slate-400">Instant delivery with live read receipts</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#170d2f] border border-white/10 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure
          </div>
          <p className="text-xs text-slate-400">End-to-end verified account protection</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#170d2f] border border-white/10 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Orders & Support
          </div>
          <p className="text-xs text-slate-400">Linked to your store orders and inquiries</p>
        </div>
      </div>

      {onStartNew && (
        <button
          onClick={onStartNew}
          className="btn btn-primary btn-sm rounded-xl gap-2 px-5 shadow-lg shadow-primary/20 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          Start New Conversation
        </button>
      )}
    </div>
  );
};
