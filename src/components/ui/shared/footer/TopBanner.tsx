'use client';

import React from 'react';
import { ChevronUp, MessageSquare } from 'lucide-react';

interface FooterTopBannerProps {
  onOpenFeedback: () => void;
}

const TopBanner = ({ onOpenFeedback }: FooterTopBannerProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#e6f1fc] text-[#0071dc] py-4 px-4 sm:px-8 border-b border-blue-100">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold">
        <div className="flex items-center gap-3">
          <span>We&apos;d love to hear what you think!</span>
          <button
            type="button"
            onClick={onOpenFeedback}
            className="px-4 py-1.5 rounded-full border-2 border-[#0071dc] hover:bg-[#0071dc] hover:text-white text-[#0071dc] transition-all font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Give feedback</span>
          </button>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-slate-50 text-[#0071dc] border border-blue-200 transition-colors shadow-sm font-bold cursor-pointer"
        >
          <span>Back to top</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default TopBanner;
