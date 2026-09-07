"use client"

import { useState } from "react";
import TopBanner from "./footer/TopBanner";
import ValueProps from "./footer/ValueProps";
import FooterLinks from "./footer/FooterLinks";
import LegalLinks from "./footer/LegalLinks";
import Copyright from "./footer/Copyright";
import FooterFeedbackModal from "./footer/FooterModal";



const Footer = () => {

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <footer className="bg-[#041e42] text-white font-sans border-t border-slate-700 select-none">
      {/* 1. WALMART TOP FEEDBACK & BACK TO TOP BANNER */}
      <TopBanner onOpenFeedback={() => setShowFeedbackModal(true)} />

      {/* 2. WALMART VALUE PROPOSITION STRIP */}
      <ValueProps />

      {/* 3. MAIN DIRECTORY LINKS LIST (WALMART STYLE INLINE & MULTI-COLUMN) */}
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FooterLinks />

        {/* Horizontal Divider */}
        <div className="border-t border-blue-900/80 pt-6">
          <LegalLinks />
          <Copyright />
        </div>
      </div>

      {/* FEEDBACK MODAL */}
      <FooterFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </footer>
  );
};

export default Footer;