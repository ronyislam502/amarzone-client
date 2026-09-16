"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Scale,
  FileText,
  Sliders,
  Sparkles,
  ChevronRight,
  Home,
  CheckCircle2,
  Printer,
  ExternalLink,
  Info,
  HelpCircle,
  Building,
  Mail,
  Phone,
  BarChart3,
  BadgePercent,
  UserCheck,
  EyeOff,
  AlertCircle,
  Share2,
} from "lucide-react";

interface SectionItem {
  id: string;
  title: string;
  badge?: string;
  summary: string;
  content: React.ReactNode;
}

export const CaPrivacyRightsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("notice-at-collection");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>("section[id]");
      const scrollPosition = window.scrollY + 220;

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

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const SECTIONS: SectionItem[] = [
    {
      id: "notice-at-collection",
      title: "1. Notice at Collection of Personal Information",
      badge: "Mandatory CCPA/CPRA",
      summary:
        "This Notice at Collection informs California consumers about the categories of personal information we collect, the business purposes for which they are used, and our retention criteria.",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Under the <strong>California Consumer Privacy Act of 2018</strong>, as amended by the{" "}
            <strong>California Privacy Rights Act of 2020 (collectively, \"CCPA/CPRA\")</strong>, Amarzone is required to provide California residents with a comprehensive Notice at Collection.
          </p>
          <p>
            We collect personal information directly from you when you create an account, purchase products from Amarzone or independent third-party merchants, interact with our customer support, or browse our marketplace.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 mt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-extrabold">
                  <th className="p-3">Category of Personal Information</th>
                  <th className="p-3">Specific Examples</th>
                  <th className="p-3">Business Purposes</th>
                  <th className="p-3">Retention Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900">A. Identifiers</td>
                  <td className="p-3 text-slate-600">Real name, postal address, email address, IP address, unique device ID.</td>
                  <td className="p-3 text-slate-600">Account management, order fulfillment, customer support, fraud prevention.</td>
                  <td className="p-3 text-slate-600 font-medium">Duration of active account + 7 years (tax/audit).</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900">B. Customer Records (Cal. Civ. Code § 1798.80)</td>
                  <td className="p-3 text-slate-600">Telephone number, billing address, encrypted payment token (no raw credit card numbers).</td>
                  <td className="p-3 text-slate-600">Billing, processing merchant dispatches, customer care outreach.</td>
                  <td className="p-3 text-slate-600 font-medium">Duration of active account + 7 years (statutory).</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900">C. Commercial Information</td>
                  <td className="p-3 text-slate-600">Records of products purchased, saved in cart, returned, or reviewed.</td>
                  <td className="p-3 text-slate-600">Order history, processing returns, warranty claims, inventory planning.</td>
                  <td className="p-3 text-slate-600 font-medium">7 years to resolve merchant/customer disputes.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900">D. Internet & Network Activity</td>
                  <td className="p-3 text-slate-600">Browsing history, search queries on Amarzone, page clicks, interaction logs.</td>
                  <td className="p-3 text-slate-600">Security diagnostics, caching, personalization, performance optimization.</td>
                  <td className="p-3 text-slate-600 font-medium">24 months in anonymized aggregate logs.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900">E. Geolocation Data</td>
                  <td className="p-3 text-slate-600">City, state, or ZIP level location derived from IP address (not precision GPS).</td>
                  <td className="p-3 text-slate-600">Estimated delivery dates, local warehouse routing, regional pricing.</td>
                  <td className="p-3 text-slate-600 font-medium">Session duration; discarded after checkout.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900">F. Sensitive Personal Information</td>
                  <td className="p-3 text-slate-600">Account login credentials (hashed/salted password) and payment tokens.</td>
                  <td className="p-3 text-slate-600">Securing your session and processing authorized transactions.</td>
                  <td className="p-3 text-slate-600 font-medium">Duration of account active status.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "statutory-rights",
      title: "2. Your Rights Under California Law (CCPA/CPRA)",
      badge: "Consumer Rights",
      summary:
        "California law grants residents 6 fundamental privacy rights, including the right to know what personal data we collect, the right to delete it, the right to correct errors, and the right to opt-out of selling or sharing.",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            As a California resident, you possess legally enforceable rights regarding your personal data. Amarzone provides direct self-service tools and an expedited request portal to exercise these rights freely:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0071dc]" />
                Right to Know & Access
              </span>
              <p className="text-xs text-slate-600">
                Request disclosure of the specific pieces of personal information we have collected about you over the preceding 12 months, along with the categories of sources and business purposes.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0071dc]" />
                Right to Request Deletion
              </span>
              <p className="text-xs text-slate-600">
                Request permanent erasure of your personal information collected and retained by Amarzone, subject to statutory exemptions (such as active warranties or tax record retention).
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0071dc]" />
                Right to Correct Inaccurate Data
              </span>
              <p className="text-xs text-slate-600">
                Request that we update or rectify any outdated or inaccurate personal information maintained in your Amarzone profile or order records.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0071dc]" />
                Right to Opt-Out of Sale / Sharing
              </span>
              <p className="text-xs text-slate-600">
                Direct Amarzone not to "sell" or "share" your personal information for cross-context behavioral advertising via our <Link href="/your-privacy-choices" className="text-[#0071dc] font-bold underline">Your Privacy Choices</Link> portal.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0071dc]" />
                Right to Limit Sensitive PI
              </span>
              <p className="text-xs text-slate-600">
                Instruct us to restrict the collection and use of sensitive personal data strictly to the operational necessities required to provide requested marketplace services.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0071dc]" />
                Right to Non-Discrimination
              </span>
              <p className="text-xs text-slate-600">
                Amarzone will never deny you goods or services, charge different prices, or provide a differing level or quality of service because you exercised any of your California privacy rights.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "sale-and-sharing",
      title: "3. Notice of Right to Opt-Out of Sale / Sharing",
      badge: "Opt-Out Portal",
      summary:
        "Amarzone does not sell personal information for monetary compensation. However, sharing data with digital advertising networks for targeted ads is considered 'sharing' under California law, which you can opt out of at any time.",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            We do <strong>not</strong> sell your personal information in the conventional sense (we never exchange your contact or personal data with data brokers for cash). However, like many modern e-commerce companies, we share identifiers and device activity with digital advertising networks to display relevant Amarzone discounts to you across the web.
          </p>
          <p>
            Under California law, this practice constitutes <strong>"sharing for cross-context behavioral advertising"</strong>. You have the unconditioned right to opt out of this sharing at any time.
          </p>

          <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0071dc]" />
                Manage Your California Opt-Out Choices
              </h4>
              <p className="text-xs text-slate-600 max-w-xl">
                Visit our dedicated opt-out portal to toggle off targeted advertising cookies, limit sensitive information, and view your Global Privacy Control (GPC) signal status.
              </p>
            </div>
            <Link
              href="/your-privacy-choices"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#0071dc] hover:bg-[#005bb5] text-white font-bold text-xs rounded-full shadow-sm transition-colors cursor-pointer"
            >
              <span>Your Privacy Choices</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: "sensitive-pi",
      title: "4. Use & Disclosure of Sensitive Personal Information",
      summary:
        "We strictly limit our use of Sensitive Personal Information to operational necessities, such as securing your session and processing authorized transactions.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Under Cal. Civ. Code § 1798.121, businesses that collect Sensitive Personal Information ("SPI") for purposes other than performing services reasonably expected by an average consumer must provide a right to limit its use.
          </p>
          <p>
            <strong>Amarzone only uses Sensitive Personal Information for exempt operational purposes</strong> authorized by California Civil Code § 1798.140(ae) and CPRA regulations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs sm:text-sm">
            <li>Processing authorized financial transactions via PCI-DSS compliant tokenization partners.</li>
            <li>Maintaining account security, verifying customer identity, and preventing malicious or fraudulent checkout attempts.</li>
            <li>Routing orders to regional warehouse facilities for prompt 2-day delivery.</li>
          </ul>
          <p className="text-xs text-slate-500 pt-1">
            Because we do not use SPI to infer consumer characteristics or for secondary commercial exploitation, an affirmative limitation request is not strictly required; however, you may review your settings in the <Link href="/your-privacy-choices" className="text-[#0071dc] font-bold underline">Your Privacy Choices</Link> portal.
          </p>
        </div>
      ),
    },
    {
      id: "financial-incentives",
      title: "5. Notice of Financial Incentives",
      badge: "Promotions & Loyalty",
      summary:
        "Amarzone occasionally offers discount coupons, member perks, and rewards programs that may be considered financial incentives under California law.",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Amarzone may offer special discount codes, referral credits, seasonal coupon rewards, or member benefits in exchange for providing your email address, subscribing to promotional alerts, or creating a free customer account.
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
              <BadgePercent className="w-4 h-4 text-emerald-600" />
              Valuation Methodology
            </h4>
            <p className="text-xs text-slate-600">
              The value of personal information provided in connection with our promotional programs is calculated based on our reasonable, good-faith estimate of the expenses incurred in offering and administering the discount, combined with aggregate revenue generated from customer purchases.
            </p>
          </div>
          <p className="text-xs text-slate-600">
            Participation is entirely voluntary. You may opt in when registering or checking out, and you may opt out at any time without penalty by unsubscribing from marketing emails or contacting customer care.
          </p>
        </div>
      ),
    },
    {
      id: "shine-the-light",
      title: "6. California 'Shine the Light' Law (Civil Code § 1798.83)",
      summary:
        "California Civil Code § 1798.83 permits California residents to request details regarding disclosure of personal information to third parties for their direct marketing purposes.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            California Civil Code § 1798.83 (known as the <strong>"Shine the Light"</strong> law) permits California residents who have established a business relationship with Amarzone to request and obtain, once per calendar year, information about personal information (if any) we disclosed to third parties for their direct marketing purposes in the preceding calendar year.
          </p>
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-emerald-950 text-xs">
            <span className="font-extrabold block mb-1">Our Policy Under Shine the Light:</span>
            Amarzone does not share customer personal information with independent third parties for their direct marketing purposes without your prior affirmative consent.
          </div>
          <p className="text-xs text-slate-600">
            To submit a formal Shine the Light inquiry, send an email to <span className="font-bold text-slate-900">california-privacy@amarzone.com</span> with "California Shine the Light Request" in the subject line.
          </p>
        </div>
      ),
    },
    {
      id: "authorized-agents",
      title: "7. Submissions by Authorized Agents",
      summary:
        "California consumers may designate an authorized agent to submit CCPA requests on their behalf subject to strict identity verification.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            You may designate an authorized agent registered with the California Secretary of State to submit a verified consumer request on your behalf.
          </p>
          <p>To protect your confidential customer records, we require authorized agents to provide:</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-600 text-xs sm:text-sm">
            <li>Written authorization signed by the California consumer granting the agent permission to act on their behalf (or proof of valid Power of Attorney pursuant to Cal. Prob. Code §§ 4000 to 4465).</li>
            <li>Independent verification of the consumer's identity directly with Amarzone prior to release of data.</li>
            <li>Verification of the agent's identity and registration with the California Secretary of State.</li>
          </ol>
        </div>
      ),
    },
    {
      id: "annual-metrics",
      title: "8. Annual CCPA Consumer Rights Metric Reporting",
      badge: "Transparency Record",
      summary:
        "Annual disclosure of California consumer requests received, complied with in whole or part, and denied during the preceding calendar year.",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            In accordance with 11 CCR § 7102, businesses that handle large volumes of consumer records disclose their annual request handling metrics for transparency:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Requests to Know</span>
              <div className="text-2xl font-black text-slate-900">1,420</div>
              <p className="text-[11px] text-emerald-600 font-bold">98.2% Complied</p>
              <p className="text-[10px] text-slate-400">Mean response time: 8.4 days</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Requests to Delete</span>
              <div className="text-2xl font-black text-slate-900">860</div>
              <p className="text-[11px] text-emerald-600 font-bold">96.4% Complied</p>
              <p className="text-[10px] text-slate-400">Exemptions: tax/statutory orders</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Opt-Out of Sale/Share</span>
              <div className="text-2xl font-black text-slate-900">14,350</div>
              <p className="text-[11px] text-emerald-600 font-bold">100% Processed</p>
              <p className="text-[10px] text-slate-400">Instant automated switchboard</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "how-to-submit",
      title: "9. How to Submit a California Consumer Request",
      summary:
        "Methods available to California residents to submit a verified consumer request free of charge.",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            You may exercise your CCPA/CPRA rights using any of the following convenient verification channels:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0071dc] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Self-Service Portal</h4>
              <p className="text-[11px] text-slate-600 leading-normal">
                Visit our interactive privacy choices dashboard to submit requests and toggle ad settings.
              </p>
              <Link
                href="/your-privacy-choices"
                className="text-xs font-bold text-[#0071dc] hover:underline inline-flex items-center gap-1"
              >
                <span>Go to Choices Portal</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Email Legal DPO</h4>
              <p className="text-[11px] text-slate-600 leading-normal">
                Send your inquiry to our California Privacy Compliance desk:
              </p>
              <a
                href="mailto:california-privacy@amarzone.com"
                className="text-xs font-bold text-slate-900 hover:text-[#0071dc] block break-all"
              >
                california-privacy@amarzone.com
              </a>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Toll-Free Hotline</h4>
              <p className="text-[11px] text-slate-600 leading-normal">
                Speak directly with a compliance specialist (Monday-Friday 8am - 8pm PT):
              </p>
              <span className="text-xs font-bold text-slate-900 block">1-800-555-AMAR</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

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
          <span className="font-bold text-slate-900">CA Privacy Rights</span>
        </nav>

        {/* Hero Section */}
        <header className="bg-gradient-to-r from-[#170d2f] via-[#1f1545] to-[#170d2f] rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold tracking-wide uppercase">
              <Scale className="w-3.5 h-3.5 text-blue-300" />
              <span>CCPA & CPRA Statutory Notice</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              California Consumer Privacy Rights & Notice at Collection
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              This California Privacy Notice supplements the Amarzone Privacy Policy and applies exclusively to consumers residing in the State of California under the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA).
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span>Effective Date: <strong>September 1, 2026</strong></span>
              <span>•</span>
              <span>Last Reviewed: <strong>Annual Compliance Audit 2026</strong></span>
            </div>
          </div>
        </header>

        {/* Quick Cross-Link Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0071dc] flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Looking for the Opt-Out Switchboard?</h3>
              <p className="text-xs text-slate-500">
                You can instantly opt out of the sale/sharing of personal data and submit direct data requests.
              </p>
            </div>
          </div>
          <Link
            href="/your-privacy-choices"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0071dc] hover:bg-[#005bb5] text-white font-bold text-xs rounded-full shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <span>Go to Your Privacy Choices</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Table of Contents */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 px-2">
                Statutory Table of Contents
              </h3>
              <nav className="space-y-1">
                {SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-colors leading-snug ${
                      activeSection === sec.id
                        ? "bg-blue-50 text-[#0071dc] font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Statutory Disclosure</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Right Content Column */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs hover:shadow-xs transition-shadow"
              >
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                    {section.title}
                  </h2>
                  {section.badge && (
                    <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0071dc] text-[11px] font-extrabold border border-blue-200">
                      {section.badge}
                    </span>
                  )}
                </div>

                {/* Plain English Summary */}
                <div className="my-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950 flex items-start gap-2.5">
                  <span className="font-extrabold shrink-0 bg-amber-200/80 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider text-amber-900">
                    Summary
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

export default CaPrivacyRightsPage;
