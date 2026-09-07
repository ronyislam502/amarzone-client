'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface FooterFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const FooterFeedbackModal = ({ isOpen, onClose }: FooterFeedbackModalProps) => {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      onClose();
      setFeedbackSubmitted(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 text-base-content rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <h3 className="text-lg font-black text-base-content mb-1">Give Us Your Feedback</h3>
        <p className="text-xs text-slate-500 mb-4">How can we improve your shopping experience at Amarzone?</p>

        {feedbackSubmitted ? (
          <div className="py-6 text-center text-emerald-600 font-bold text-sm">
            <Check className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
            Thank you! Your feedback helps us serve you better.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows={4}
              required
              placeholder="Tell us what you loved or what we can do better..."
              className="w-full p-3 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#0071dc] resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0071dc] hover:bg-[#005bb5] text-white font-bold text-xs rounded-xl transition-colors shadow cursor-pointer"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


export default FooterFeedbackModal