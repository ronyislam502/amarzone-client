"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Server,
  KeyRound,
  FileCheck,
  CreditCard,
  Building2,
  Users,
  Bell,
  Smartphone,
  MapPin,
  HelpCircle,
  Mail,
  Phone,
  Printer,
  ChevronRight,
  Home,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";

interface SectionItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  summary: string;
  content: React.ReactNode;
}

export const PrivacyAndSecurityPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("commitments");

  // Interactive Privacy Preferences state
  const [prefRecommendations, setPrefRecommendations] = useState(true);
  const [prefOrderSms, setPrefOrderSms] = useState(true);
  const [prefAnalytics, setPrefAnalytics] = useState(false);
  const [prefLocation, setPrefLocation] = useState(true);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>("section[id]");
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSavePreferences = () => {
    toast.success("Your privacy preferences have been updated and saved!", {
      position: "bottom-right",
      autoClose: 2500,
    });
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const SECTIONS: SectionItem[] = [
    {
      id: "commitments",
      title: "1. Our Core Privacy Commitments",
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      summary:
        "We never sell your personal information to third parties or brokers. Your data is used exclusively to fulfill orders, prevent fraud, and enhance your shopping experience.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            At <strong>Amarzone</strong>, we believe privacy is a fundamental consumer right. Trust is the foundation of our multi-vendor marketplace, and we treat your personal and financial information with the utmost respect and security.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Never Sold
              </span>
              <p className="text-[11px] text-slate-500">We do not sell, rent, or trade your contact or behavioral details to data brokers.</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Data Minimization
              </span>
              <p className="text-[11px] text-slate-500">We only collect data that is strictly required to process and ship your orders.</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Full User Control
              </span>
              <p className="text-[11px] text-slate-500">You can download, export, or permanently delete your account data anytime.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "collection",
      title: "2. What Information We Collect & Why",
      icon: <FileCheck className="w-4 h-4 text-[#0071dc]" />,
      summary:
        "We collect contact details, shipping addresses, encrypted payment tokens, and browsing preferences solely to process purchases and personalize catalog selections.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Depending on how you interact with Amarzone, we collect the following categories of information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Account & Profile Information:</strong> Name, email address, password hash, phone number, and default delivery addresses.
            </li>
            <li>
              <strong>Transaction & Order Details:</strong> Items purchased, shipping carrier tracking codes, return requests, and order timestamps.
            </li>
            <li>
              <strong>Payment Metadata:</strong> Encrypted card tokens provided by PCI-compliant payment partners (Stripe). We never store raw 16-digit card numbers or CVV codes on Amarzone servers.
            </li>
            <li>
              <strong>Technical Device Data:</strong> IP address, browser type, operating system version, and session identifiers used to detect fraud.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "marketplace-data",
      title: "3. Multi-Vendor Data Sharing & Protection",
      icon: <Building2 className="w-4 h-4 text-purple-600" />,
      summary:
        "Independent vendors only receive the recipient name and shipping address required to deliver your package. They never see your billing details or payment cards.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Because Amarzone connects you with 50,000+ verified independent merchants, maintaining strict boundaries between customer data and vendor access is essential:
          </p>
          <div className="overflow-hidden rounded-2xl border border-slate-200 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900">
                  <th className="p-3 font-bold">What Merchants Can See</th>
                  <th className="p-3 font-bold text-rose-600">What Merchants NEVER See</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-3">Recipient Shipping Address & Full Name</td>
                  <td className="p-3 font-medium text-slate-800">Your Credit/Debit Card or Bank Details</td>
                </tr>
                <tr>
                  <td className="p-3">Selected Item Variants & Quantity</td>
                  <td className="p-3 font-medium text-slate-800">Your Full Amarzone Account Password or Hash</td>
                </tr>
                <tr>
                  <td className="p-3">Order Number & Tracking Carrier</td>
                  <td className="p-3 font-medium text-slate-800">Your Past Browsing History on Other Vendors</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            Vendors are bound by legally enforceable Data Protection Addendums prohibiting them from storing your shipping details outside of order fulfillment purposes.
          </p>
        </div>
      ),
    },
    {
      id: "payment-security",
      title: "4. Payment Security & Encryption Architecture",
      icon: <CreditCard className="w-4 h-4 text-emerald-600" />,
      summary:
        "All transactions are protected by 256-bit TLS 1.3 encryption and processed via Level 1 PCI-DSS certified gateway tokenization.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            When you enter payment information during checkout, your transaction is protected by state-of-the-art cryptographic standards:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-xs">PCI-DSS Level 1 Certification</h4>
              </div>
              <p className="text-xs text-slate-500">
                Payment information is routed directly to Stripe&apos;s hardened card vaults. Raw cardholder data never touches or persists on our application servers.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#0071dc]" />
                <h4 className="font-bold text-slate-900 text-xs">End-to-End TLS 1.3 Encryption</h4>
              </div>
              <p className="text-xs text-slate-500">
                All data transmitted between your browser and our cloud edge uses high-grade 256-bit encryption with Perfect Forward Secrecy (PFS).
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "preferences",
      title: "5. Interactive Privacy Preferences & Cookie Controls",
      icon: <Sliders className="w-4 h-4 text-[#0071dc]" />,
      summary:
        "Manage your personal data preferences, recommendation algorithms, and notification channels in real time below.",
      content: (
        <div className="space-y-4 pt-1">
          <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-900">
                Customizable Privacy Controls
              </span>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Active Settings
              </span>
            </div>

            {/* Toggle 1 */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Personalized Product Recommendations</p>
                <p className="text-[11px] text-slate-500">
                  Allow Amarzone to tailor carousel deals and rollbacks based on your browsing history.
                </p>
              </div>
              <input
                type="checkbox"
                checked={prefRecommendations}
                onChange={(e) => setPrefRecommendations(e.target.checked)}
                className="toggle toggle-primary toggle-sm cursor-pointer"
              />
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Order & Delivery SMS Notifications</p>
                <p className="text-[11px] text-slate-500">
                  Receive real-time tracking updates when packages are dispatched or out for delivery.
                </p>
              </div>
              <input
                type="checkbox"
                checked={prefOrderSms}
                onChange={(e) => setPrefOrderSms(e.target.checked)}
                className="toggle toggle-primary toggle-sm cursor-pointer"
              />
            </div>

            {/* Toggle 3 */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Third-Party Analytics & Metrics</p>
                <p className="text-[11px] text-slate-500">
                  Help us understand platform traffic to optimize page speed and catalog performance.
                </p>
              </div>
              <input
                type="checkbox"
                checked={prefAnalytics}
                onChange={(e) => setPrefAnalytics(e.target.checked)}
                className="toggle toggle-primary toggle-sm cursor-pointer"
              />
            </div>

            {/* Toggle 4 */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Location-Based Local Warehouse Stock</p>
                <p className="text-[11px] text-slate-500">
                  Estimate accurate 2-day delivery estimates based on your regional ZIP code.
                </p>
              </div>
              <input
                type="checkbox"
                checked={prefLocation}
                onChange={(e) => setPrefLocation(e.target.checked)}
                className="toggle toggle-primary toggle-sm cursor-pointer"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-5 py-2 bg-[#0071dc] hover:bg-[#005bb5] text-white font-bold text-xs rounded-full shadow-xs transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "rights",
      title: "6. Your Privacy Rights (GDPR, CCPA & Global)",
      icon: <Users className="w-4 h-4 text-indigo-600" />,
      summary:
        "You have the right to access, export, correct, or permanently delete your personal account data at any time without penalty.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Regardless of where you reside, Amarzone extends universal privacy rights to all registered customers and guest shoppers:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Right to Access & Portability:</strong> Request a full machine-readable JSON copy of all personal records and order histories.
            </li>
            <li>
              <strong>Right to Rectification:</strong> Update or correct inaccurate addresses, phone numbers, or account profiles instantly.
            </li>
            <li>
              <strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request permanent deletion of your account and personal identifiers from our production databases.
            </li>
            <li>
              <strong>Non-Discrimination:</strong> We will never deny services, charge differing prices, or provide degraded performance if you exercise your legal privacy rights.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "security-architecture",
      title: "7. Technical Security Architecture & Audits",
      icon: <Server className="w-4 h-4 text-teal-600" />,
      summary:
        "Our infrastructure is safeguarded by automated intrusion detection, 2FA enforcement, multi-region database backups, and annual independent pen-testing.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-2xs">
              <KeyRound className="w-5 h-5 text-indigo-600" />
              <h4 className="font-black text-slate-900 text-xs">AES-256 Storage Encryption</h4>
              <p className="text-[11px] text-slate-500">
                All production databases, cloud backups, and disk volumes are encrypted with AES-256 keys rotated automatically.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="font-black text-slate-900 text-xs">Machine Learning Fraud Detection</h4>
              <p className="text-[11px] text-slate-500">
                Intelligent behavioral models analyze checkout anomalies to prevent credential stuffing and identity theft in real time.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "children",
      title: "8. Protection of Children's Privacy",
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      summary:
        "Amarzone does not knowingly solicit or collect personal information from children under the age of 13 without verifiable parental consent.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Our marketplace is designed for adult consumers and authorized account holders. If we discover that personal information has been collected from a child under 13 without verified parental consent, we will promptly delete that data from our production systems. Parents or guardians may contact our privacy office to review or request deletion of child information.
          </p>
        </div>
      ),
    },
    {
      id: "contact-dpo",
      title: "9. Data Protection Officer (DPO) Contact",
      icon: <Mail className="w-4 h-4 text-[#0071dc]" />,
      summary:
        "Contact our dedicated Privacy & Security team directly for data access requests, vulnerability disclosures, or regulatory questions.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            If you have inquiries regarding this Privacy Policy or wish to file a formal data access or deletion request:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0071dc] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Privacy Office & DPO</p>
                <p className="text-xs text-[#0071dc] font-semibold">privacy@amarzone.com</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Security Response Team</p>
                <p className="text-xs text-emerald-700 font-semibold">security@amarzone.com</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#f3f4f6]/50 text-slate-800 font-sans antialiased">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80 py-3">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-[#0071dc] transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span className="font-semibold">Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-600 font-medium">Trust & Compliance</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-bold">Privacy & Security</span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#170d2f] via-[#211244] to-[#120925] text-white py-16 sm:py-20">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 text-xs font-black uppercase tracking-wider text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Amarzone Trust Center</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]">
              Your Privacy. Our Responsibility. <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Never Sold. Always Protected.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Learn how we safeguard your personal data, secure multi-vendor marketplace transactions, and empower you with full control over your digital footprint.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-2xl border border-white/10">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">256-Bit SSL</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-2xl border border-white/10">
                <CreditCard className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">PCI-DSS Level 1</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-2xl border border-white/10">
                <FileCheck className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-xs font-bold text-slate-200">GDPR & CCPA</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-2xl border border-white/10">
                <EyeOff className="w-4 h-4 text-purple-300 shrink-0" />
                <span className="text-xs font-bold text-slate-200">Zero Data Sales</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 3. Main Layout: Sticky Table of Contents + Content */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar (Sticky) */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-6 select-none">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText className="w-4 h-4 text-[#0071dc]" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Trust Center Index
                </h2>
              </div>

              <nav className="mt-3 space-y-1 max-h-[60vh] overflow-y-auto no-scrollbar">
                {SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-blue-50 text-[#0071dc] font-bold shadow-2xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <span className="shrink-0">{sec.icon}</span>
                      <span className="truncate">{sec.title}</span>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Quick Actions
              </h3>
              <button
                type="button"
                onClick={handlePrint}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-full border border-slate-200 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Policy</span>
              </button>
              <a
                href="#contact-dpo"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-[#0071dc] text-xs font-bold rounded-full border border-blue-200 transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact DPO</span>
              </a>
            </div>
          </aside>

          {/* Right Main Column */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs hover:shadow-xs transition-shadow"
              >
                {/* Section Header */}
                <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#0071dc] flex items-center justify-center shrink-0 mt-0.5">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                </div>

                {/* Plain English Summary */}
                <div className="my-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950 flex items-start gap-2.5">
                  <span className="font-extrabold shrink-0 bg-amber-200/80 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider text-amber-900">
                    In Plain English
                  </span>
                  <p className="font-medium leading-relaxed">{section.summary}</p>
                </div>

                {/* Content */}
                <div className="pt-2">{section.content}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyAndSecurityPage;
