"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sliders,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Home,
  ChevronRight,
  Info,
  Radio,
  FileCheck,
  Send,
  Lock,
  User,
  Mail,
  MapPin,
  HelpCircle,
  Globe,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";

export const YourPrivacyChoicesPage: React.FC = () => {
  // GPC (Global Privacy Control) detection state
  const [gpcDetected, setGpcDetected] = useState<boolean>(false);

  // Opt-out Switchboard states
  const [optOutTargetedAds, setOptOutTargetedAds] = useState<boolean>(false);
  const [limitSensitivePI, setLimitSensitivePI] = useState<boolean>(false);
  const [optOutProfiling, setOptOutProfiling] = useState<boolean>(false);
  const [optOutMarketingEmail, setOptOutMarketingEmail] = useState<boolean>(false);
  const [optOutMarketingSms, setOptOutMarketingSms] = useState<boolean>(false);

  // Consumer Request Form states
  const [requestType, setRequestType] = useState<string>("know");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [stateResidence, setStateResidence] = useState<string>("California");
  const [isAuthorizedAgent, setIsAuthorizedAgent] = useState<boolean>(false);
  const [agentName, setAgentName] = useState<string>("");
  const [requestNotes, setRequestNotes] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Detect GPC on mount
  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const gpc = (navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl;
      if (gpc === true) {
        setGpcDetected(true);
        setOptOutTargetedAds(true);
        setOptOutProfiling(true);
      }
    }
  }, []);

  const handleSaveChoices = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your privacy choices have been successfully updated and applied!", {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      toast.error("Please fill out all required fields before submitting.", {
        position: "bottom-right",
      });
      return;
    }

    setFormSubmitted(true);
    const trackingId = `AMAR-CCPA-${Math.floor(100000 + Math.random() * 900000)}`;
    toast.success(`Request submitted successfully! Tracking ID: ${trackingId}`, {
      position: "bottom-right",
      autoClose: 4000,
    });
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-8 text-slate-900">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#0071dc] flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/privacy-and-security" className="hover:text-[#0071dc]">
            Privacy & Security
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-bold text-slate-900">Your Privacy Choices</span>
        </nav>

        {/* Hero Section */}
        <header className="bg-gradient-to-r from-[#170d2f] via-[#1f1545] to-[#170d2f] rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            {/* Stylized California Opt-Out Choice Emblem */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-bold">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black mr-1">
                ✓
              </span>
              <span>Official State Privacy Choices Portal</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Your Privacy Choices & Opt-Out Center
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Under California (CCPA/CPRA), Colorado (CPA), Connecticut (CTDPA), Virginia (VCDPA), Utah (UCPA), and other state privacy laws, you have the right to opt out of the sale or sharing of your personal information for cross-context behavioral advertising and to limit the use of your sensitive personal data.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-blue-200">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Zero monetary sale of data
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Universal opt-out signals honored
              </span>
              <span>•</span>
              <Link href="/ca-privacy-rights" className="text-blue-300 hover:text-white font-bold underline inline-flex items-center gap-1">
                <span>View CA Privacy Rights Notice</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </header>

        {/* Global Privacy Control (GPC) Signal Detector Banner */}
        <div className="mb-8 p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                gpcDetected ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-[#0071dc]"
              }`}>
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Global Privacy Control (GPC) Status:
                  </h3>
                  {gpcDetected ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Signal Active & Honored
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                      No Signal Broadcast
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {gpcDetected
                    ? "Amarzone detected a Global Privacy Control signal from your browser. Cross-context advertising cookies and algorithmic profiling have been automatically disabled for this device."
                    : "Your browser is not transmitting an automated Global Privacy Control (GPC) signal. You can still set your preferences manually using the switches below, or configure GPC in browsers like Firefox, Brave, or DuckDuckGo."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Opt-Out Switchboard */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#0071dc] flex items-center justify-center shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Instant Privacy Switchboard
                  </h2>
                  <p className="text-xs text-slate-500">
                    Toggle your choices below to instantly update how your data is handled on this browser session.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveChoices} className="divide-y divide-slate-100 mt-4">
                {/* Switch 1: Do Not Sell or Share */}
                <div className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <label htmlFor="optOutTargetedAds" className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2 cursor-pointer">
                      <span>Do Not Sell or Share My Personal Information</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                        CCPA Mandated
                      </span>
                    </label>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Opt out of sharing your identifiers and browsing activity with third-party digital advertising partners for cross-context behavioral marketing.
                    </p>
                  </div>
                  <input
                    id="optOutTargetedAds"
                    type="checkbox"
                    checked={optOutTargetedAds}
                    onChange={(e) => setOptOutTargetedAds(e.target.checked)}
                    className="toggle toggle-primary shrink-0 mt-1 cursor-pointer"
                  />
                </div>

                {/* Switch 2: Limit Sensitive PI */}
                <div className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <label htmlFor="limitSensitivePI" className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2 cursor-pointer">
                      <span>Limit the Use of My Sensitive Personal Information</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-[#0071dc] text-[10px] font-bold uppercase tracking-wider">
                        CPRA § 1798.121
                      </span>
                    </label>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Instruct Amarzone to limit the collection and use of sensitive personal information solely to what is strictly necessary to fulfill your purchases and maintain platform security.
                    </p>
                  </div>
                  <input
                    id="limitSensitivePI"
                    type="checkbox"
                    checked={limitSensitivePI}
                    onChange={(e) => setLimitSensitivePI(e.target.checked)}
                    className="toggle toggle-primary shrink-0 mt-1 cursor-pointer"
                  />
                </div>

                {/* Switch 3: Automated Decision Making */}
                <div className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <label htmlFor="optOutProfiling" className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2 cursor-pointer">
                      <span>Opt Out of Automated Profiling & Algorithm Recommendations</span>
                    </label>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Disable algorithmic behavioral profiling that predicts your shopping preferences or customizes item discovery on the homepage.
                    </p>
                  </div>
                  <input
                    id="optOutProfiling"
                    type="checkbox"
                    checked={optOutProfiling}
                    onChange={(e) => setOptOutProfiling(e.target.checked)}
                    className="toggle toggle-primary shrink-0 mt-1 cursor-pointer"
                  />
                </div>

                {/* Switch 4: Marketing Communications */}
                <div className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <label htmlFor="optOutMarketingEmail" className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2 cursor-pointer">
                      <span>Opt Out of Promotional Marketing Emails</span>
                    </label>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Unsubscribe from seasonal discount announcements, curated vendor deals, and newsletter drops (transactional order receipts will still be sent).
                    </p>
                  </div>
                  <input
                    id="optOutMarketingEmail"
                    type="checkbox"
                    checked={optOutMarketingEmail}
                    onChange={(e) => setOptOutMarketingEmail(e.target.checked)}
                    className="toggle toggle-primary shrink-0 mt-1 cursor-pointer"
                  />
                </div>

                {/* Switch 5: SMS Notifications */}
                <div className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <label htmlFor="optOutMarketingSms" className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2 cursor-pointer">
                      <span>Opt Out of SMS Text Marketing</span>
                    </label>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Stop receiving promotional text messages and flash sale coupons sent to your registered mobile number.
                    </p>
                  </div>
                  <input
                    id="optOutMarketingSms"
                    type="checkbox"
                    checked={optOutMarketingSms}
                    onChange={(e) => setOptOutMarketingSms(e.target.checked)}
                    className="toggle toggle-primary shrink-0 mt-1 cursor-pointer"
                  />
                </div>

                <div className="pt-5 flex items-center justify-between gap-4">
                  <span className="text-[11px] text-slate-400">
                    Preferences are stored in your session cookie and Amarzone account profile.
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0071dc] hover:bg-[#005bb5] text-white text-xs font-black rounded-full shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
                  >
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>

            {/* Informative FAQ Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0071dc]" />
                Frequently Asked Privacy Questions
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h4 className="font-bold text-slate-900 mb-1">What does "selling" or "sharing" mean under state laws?</h4>
                  <p>
                    Under California law (CCPA/CPRA), "selling" includes sharing consumer personal data with third parties for monetary or other valuable consideration, while "sharing" refers specifically to targeting ads across different websites and services. Amarzone does not sell data for cash, but we provide this switchboard to grant you complete control over digital ad cookies.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h4 className="font-bold text-slate-900 mb-1">Will opting out affect my ability to buy products on Amarzone?</h4>
                  <p>
                    No. Opting out will not affect your ability to purchase items, receive 2-day delivery, earn loyalty rewards, or contact customer care. You will still receive essential order status confirmations and receipts.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h4 className="font-bold text-slate-900 mb-1">How does Amarzone verify my identity for access or deletion requests?</h4>
                  <p>
                    When you submit a verified data request, we verify your identity by sending a secure confirmation code to the email address associated with your Amarzone account, ensuring unauthorized parties cannot access or delete your records.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Verified Consumer Data Request Form */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Submit a Verified Data Request
                  </h2>
                  <p className="text-xs text-slate-500">
                    Exercise your statutory Right to Know, Right to Delete, or Right to Correct under state privacy laws.
                  </p>
                </div>
              </div>

              {formSubmitted ? (
                <div className="p-6 text-center space-y-3 mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-emerald-950">
                    Request Received & Logged
                  </h3>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                    We have dispatched a verification email to <strong>{email}</strong>. Please click the link in that message to verify your identity. In accordance with statutory guidelines, we will complete your request within 45 days.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFirstName("");
                      setLastName("");
                      setEmail("");
                      setRequestNotes("");
                    }}
                    className="mt-2 px-5 py-2 bg-emerald-700 text-white text-xs font-bold rounded-full hover:bg-emerald-800 transition-colors cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 mt-4 text-xs">
                  {/* Request Type Selector */}
                  <div>
                    <label className="block text-slate-900 font-extrabold mb-1.5">
                      Request Type <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <label className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-colors ${
                        requestType === "know"
                          ? "bg-blue-50/60 border-[#0071dc] text-[#0071dc]"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}>
                        <input
                          type="radio"
                          name="requestType"
                          value="know"
                          checked={requestType === "know"}
                          onChange={() => setRequestType("know")}
                          className="mt-0.5"
                        />
                        <div>
                          <span className="font-bold block text-slate-900">Right to Know / Access</span>
                          <span className="text-[11px] text-slate-500">Receive a copy of personal information collected over the last 12 months.</span>
                        </div>
                      </label>

                      <label className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-colors ${
                        requestType === "delete"
                          ? "bg-blue-50/60 border-[#0071dc] text-[#0071dc]"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}>
                        <input
                          type="radio"
                          name="requestType"
                          value="delete"
                          checked={requestType === "delete"}
                          onChange={() => setRequestType("delete")}
                          className="mt-0.5"
                        />
                        <div>
                          <span className="font-bold block text-slate-900">Right to Delete</span>
                          <span className="text-[11px] text-slate-500">Permanently erase your Amarzone account and associated personal history.</span>
                        </div>
                      </label>

                      <label className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-colors ${
                        requestType === "correct"
                          ? "bg-blue-50/60 border-[#0071dc] text-[#0071dc]"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}>
                        <input
                          type="radio"
                          name="requestType"
                          value="correct"
                          checked={requestType === "correct"}
                          onChange={() => setRequestType("correct")}
                          className="mt-0.5"
                        />
                        <div>
                          <span className="font-bold block text-slate-900">Right to Correct</span>
                          <span className="text-[11px] text-slate-500">Update inaccurate or outdated personal records in our database.</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-900 font-extrabold mb-1">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0071dc] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-900 font-extrabold mb-1">
                        Last Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0071dc] text-xs"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-slate-900 font-extrabold mb-1">
                      Account Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john.doe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0071dc] text-xs"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      We will send an identity verification email to this address.
                    </span>
                  </div>

                  {/* State of Residence */}
                  <div>
                    <label className="block text-slate-900 font-extrabold mb-1">
                      State / Territory of Residence <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={stateResidence}
                      onChange={(e) => setStateResidence(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0071dc] text-xs bg-white"
                    >
                      <option value="California">California (CCPA/CPRA)</option>
                      <option value="Colorado">Colorado (CPA)</option>
                      <option value="Connecticut">Connecticut (CTDPA)</option>
                      <option value="Virginia">Virginia (VCDPA)</option>
                      <option value="Utah">Utah (UCPA)</option>
                      <option value="Texas">Texas (TDPSA)</option>
                      <option value="Oregon">Oregon (OCPA)</option>
                      <option value="Other">Other US State / International</option>
                    </select>
                  </div>

                  {/* Authorized Agent Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAuthorizedAgent}
                        onChange={(e) => setIsAuthorizedAgent(e.target.checked)}
                        className="checkbox checkbox-sm checkbox-primary rounded"
                      />
                      <span className="text-xs text-slate-700 font-medium">
                        I am an Authorized Agent submitting on behalf of a consumer.
                      </span>
                    </label>

                    {isAuthorizedAgent && (
                      <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <label className="block text-slate-900 font-extrabold text-[11px]">
                          Authorized Agent Legal Name / Agency
                        </label>
                        <input
                          type="text"
                          placeholder="Agent Name or Firm"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                        />
                        <span className="text-[10px] text-slate-500 block">
                          Proof of written power of attorney or signed consumer authorization will be requested.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Notes / Details */}
                  <div>
                    <label className="block text-slate-900 font-extrabold mb-1">
                      Additional Details / Instructions (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify specific order dates, email aliases, or account details to assist our data lookup..."
                      value={requestNotes}
                      onChange={(e) => setRequestNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0071dc] text-xs resize-none"
                    />
                  </div>

                  {/* Legal Attestation */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] text-slate-500 leading-normal">
                    By submitting this form, you declare under penalty of perjury that you are the consumer whose personal information is the subject of the request (or their lawful authorized agent).
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0071dc] hover:bg-[#005bb5] text-white font-black text-xs rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Verified Privacy Request</span>
                  </button>
                </form>
              )}
            </div>

            {/* Toll Free Helpline Card */}
            <div className="p-5 bg-gradient-to-br from-slate-900 to-[#170d2f] text-white rounded-3xl space-y-2 shadow-sm">
              <h4 className="font-extrabold text-xs sm:text-sm flex items-center gap-2 text-white">
                <Lock className="w-4 h-4 text-blue-400" />
                Prefer to Submit by Phone?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                You may also submit verified consumer requests or opt-out instructions by calling our dedicated toll-free privacy hotline:
              </p>
              <div className="pt-1 flex items-center gap-2">
                <span className="text-base font-black text-blue-300 tracking-wide">1-800-555-AMAR</span>
                <span className="text-[10px] text-slate-400">(Toll-Free, 24/7 Voice Automated Line)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default YourPrivacyChoicesPage;
