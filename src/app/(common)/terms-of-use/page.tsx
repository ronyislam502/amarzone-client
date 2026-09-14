"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Printer,
  ChevronRight,
  Home,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Mail,
  Phone,
  Scale,
  Building2,
  ShoppingBag,
  CreditCard,
  Truck,
  MessageSquare,
  Lock,
} from "lucide-react";

interface SectionItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  summary: string;
  content: React.ReactNode;
}

export const TermsOfUsePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("acceptance");

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

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const SECTIONS: SectionItem[] = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms & Eligibility",
      icon: <Scale className="w-4 h-4 text-[#0071dc]" />,
      summary:
        "By browsing, accessing, or purchasing through Amarzone, you legally agree to these Terms. You must be at least 18 years old or have parental consent.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Welcome to <strong>Amarzone</strong> (&quot;Platform,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). These Terms of Use constitute a legally binding agreement between you, whether personally or on behalf of an entity (&quot;you,&quot; &quot;User,&quot; or &quot;Customer&quot;), and Amarzone Marketplace Inc. regarding your access to and use of the Amarzone website, applications, and commerce services.
          </p>
          <p>
            By accessing or using any portion of the platform, you certify that you have read, understood, and agreed to be bound by these Terms, our Privacy Policy, and any supplemental terms posted on specific services. If you do not agree to all terms, you are expressly prohibited from using the platform and must discontinue access immediately.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>You must be at least 18 years of age or the age of majority in your jurisdiction.</li>
            <li>You possess the legal authority and capacity to enter into binding contractual commitments.</li>
            <li>You agree to comply with all applicable local, national, and international laws, statutes, and regulations.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "accounts",
      title: "2. User Accounts & Security",
      icon: <Lock className="w-4 h-4 text-purple-600" />,
      summary:
        "You are responsible for keeping your password secure and your account info accurate. Notify us immediately if you suspect unauthorized access.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            To access certain features, including saving wishlists, placing orders, leaving verified reviews, and managing vendor portals, you must register for an Amarzone account.
          </p>
          <p>
            You agree to provide true, accurate, current, and complete information during registration and to promptly update such information to maintain its accuracy. You are solely responsible for safeguarding your credentials, passwords, and two-factor authentication tokens.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Account Security Responsibilities
            </h4>
            <p className="text-slate-600">
              Amarzone cannot and will not be liable for any loss or damage arising from your failure to maintain account confidentiality. We reserve the right to suspend or terminate accounts that contain false registration details or violate security policies.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "marketplace",
      title: "3. Multi-Vendor Marketplace Operations",
      icon: <Building2 className="w-4 h-4 text-indigo-600" />,
      summary:
        "Amarzone provides an e-commerce platform where independent third-party vendors and verified sellers showcase, market, and fulfill consumer products.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Amarzone operates as a multi-vendor digital marketplace. Certain products offered on the site are sold directly by independent third-party merchants (&quot;Vendors&quot; or &quot;Sellers&quot;), while others may be fulfilled directly via Amarzone Logistics.
          </p>
          <p>
            Each product page explicitly designates the merchant (&quot;Sold and shipped by [Vendor Name]&quot;). When you buy from an independent vendor:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>The commercial contract for sale is directly between you and the designated vendor.</li>
            <li>Amarzone facilitates the transaction, processes secure payments, and provides dispute mediation through the Amarzone Buyer Protection program.</li>
            <li>Vendors are contractually bound to comply with quality standards, authentic merchandise guarantees, and transparent fulfillment schedules.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "pricing",
      title: "4. Pricing, Rollbacks & Product Accuracy",
      icon: <ShoppingBag className="w-4 h-4 text-emerald-600" />,
      summary:
        "We strive for 100% catalog accuracy, but errors in prices or specifications can occur. We reserve the right to correct pricing errors and cancel impacted orders.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Prices, discounts, rollback promotions, and product availability are subject to change without notice. While we endeavor to ensure all descriptions, imagery, specifications, and prices displayed are exact:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Rollback & Was Pricing:</strong> Strikethrough &quot;Was&quot; prices indicate the verified historical retail price previously offered by vendors or competitors.
            </li>
            <li>
              <strong>Pricing Errors:</strong> In the rare event that an item is listed at an incorrect price due to typographical or technological error, Amarzone and its vendors retain the right to cancel or refuse orders placed for that item prior to shipment.
            </li>
            <li>
              <strong>Color & Appearance:</strong> Because computer monitors and mobile screens render colors differently, we cannot guarantee your display will mirror actual merchandise textures with absolute fidelity.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "orders",
      title: "5. Order Acceptance, Payments & Billing",
      icon: <CreditCard className="w-4 h-4 text-[#0071dc]" />,
      summary:
        "Placing an order is an offer to buy. Orders are officially accepted when payment is verified and a tracking number is dispatched.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Your receipt of an electronic order confirmation does not signify our final acceptance of your order. We reserve the right to limit order quantities, verify customer identity, or decline orders deemed fraudulent or suspicious.
          </p>
          <p>
            We support multiple encrypted payment gateways, including credit/debit cards via Stripe, digital wallets, and approved regional payment options. By providing payment details:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>You represent that you have legal authorization to use the payment method provided.</li>
            <li>You authorize us and our merchant processing partners to charge the full order total, including applicable sales taxes and shipping fees.</li>
            <li>If your payment cannot be authorized or is revoked, we will immediately cancel your order.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "6. Shipping, Delivery & Free 90-Day Returns",
      icon: <Truck className="w-4 h-4 text-amber-600" />,
      summary:
        "Qualifying orders over $35 enjoy fast 2-day delivery. Most items are eligible for hassle-free returns within 90 days of receipt.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Shipping costs and delivery timelines are calculated at checkout based on destination, item dimensions, and fulfillment velocity. Delivery promises are estimates made in good faith and may be subject to carrier delays or extreme weather events.
          </p>
          <p>
            <strong>90-Day Free Return Policy:</strong> We stand behind our customer experience. Most unused merchandise in original packaging may be returned within 90 calendar days of delivery for a full refund or replacement.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Electronics and major appliances may have dedicated 30-day testing periods.</li>
            <li>Return shipping labels are complimentary for items with manufacturing defects or fulfillment discrepancies.</li>
            <li>Refunds are credited to the original payment method within 3 to 7 business days following inspection.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "prohibited",
      title: "7. Prohibited Conduct & Platform Integrity",
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
      summary:
        "Do not misuse our platform, scrape content without authorization, attempt unauthorized server access, or post misleading product reviews.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>You agree not to engage in any prohibited activities on Amarzone, including but not limited to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Automated data scraping, crawling, or harvesting of product listings, pricing, or reviews without written consent.</li>
            <li>Attempting to breach, probe, or compromise server security, APIs, or database integrity.</li>
            <li>Submitting fraudulent orders, chargebacks, or utilizing stolen payment credentials.</li>
            <li>Impersonating another customer, merchant vendor, or Amarzone platform administrator.</li>
            <li>Introducing viruses, trojans, ransomware, or malicious automated scripts.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "intellectual",
      title: "8. Intellectual Property & Trademarks",
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
      summary:
        "All software, UI designs, code, graphics, and trademarks are the property of Amarzone or licensed brand owners.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            The Amarzone platform, including its software algorithms, user interface designs, logos, graphics, icons, text, audio clips, and code, is the exclusive intellectual property of Amarzone Marketplace Inc. and protected by copyright, trademark, and trade dress statutes.
          </p>
          <p>
            Product names, brand logos (such as Apple, Samsung, TevraPet, etc.), and associated trademarks appearing on listings belong to their respective proprietary owners and are displayed strictly for product identification and commercial retail purposes.
          </p>
        </div>
      ),
    },
    {
      id: "reviews",
      title: "9. Customer Reviews & User Submissions",
      icon: <MessageSquare className="w-4 h-4 text-teal-600" />,
      summary:
        "Customer reviews must reflect honest, firsthand experiences. Fake reviews, incentivized reviews, or hate speech will be removed.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            We encourage honest, constructive customer reviews, questions, and feedback. By submitting reviews or user content:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>You grant Amarzone a worldwide, royalty-free, perpetual license to display, publish, and translate your review.</li>
            <li>You warrant that your review represents your genuine experience with the product.</li>
            <li>We prohibit paid reviews, vendor competitor sabotage, profane language, harassment, or personally identifiable information.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "disclaimers",
      title: "10. Disclaimers & Limitation of Liability",
      icon: <Scale className="w-4 h-4 text-slate-600" />,
      summary:
        "The platform is provided 'as is'. To the extent permitted by law, Amarzone is not liable for indirect, incidental, or consequential damages.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            THE AMARZONE PLATFORM AND ALL MERCHANDISE, CONTENT, AND SERVICES INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THE PLATFORM ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, UNLESS OTHERWISE SPECIFIED IN WRITING.
          </p>
          <p>
            TO THE FULLEST EXTENT PERMISSIBLE BY APPLICABLE JURISDICTIONAL LAW, AMARZONE DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. IN NO EVENT SHALL AMARZONE BE LIABLE FOR INDIRECT, PUNITIVE, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE PLATFORM.
          </p>
        </div>
      ),
    },
    {
      id: "disputes",
      title: "11. Dispute Resolution & Governing Law",
      icon: <Building2 className="w-4 h-4 text-slate-700" />,
      summary:
        "Disputes are resolved through friendly customer mediation first, followed by binding arbitration where applicable.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            <strong>Informal Resolution:</strong> Most customer concerns can be resolved rapidly by contacting our 24/7 Amarzone Customer Care Center. We encourage reaching out to us before initiating formal legal proceedings.
          </p>
          <p>
            <strong>Arbitration Agreement:</strong> Any dispute, controversy, or claim relating in any way to your visit to Amarzone or products purchased through the platform shall be submitted to confidential, binding arbitration in accordance with commercial arbitration rules, rather than in court.
          </p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "12. Contact & Legal Notices",
      icon: <HelpCircle className="w-4 h-4 text-[#0071dc]" />,
      summary:
        "Have questions about our Terms of Use? Our legal and customer support teams are available 24/7.",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            If you have questions, feedback, or legal inquiries regarding these Terms of Use, please contact us through any of the channels below:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0071dc] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Legal Department</p>
                <p className="text-xs text-[#0071dc] font-semibold">legal@amarzone.com</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Customer Support</p>
                <p className="text-xs text-emerald-700 font-semibold">+1 (800) 555-AMARZONE</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#f3f4f6]/50 text-slate-800 font-sans antialiased">
      {/* Top Banner & Breadcrumb Header */}
      <div className="border-b border-slate-200/80 bg-white py-4">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-3 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-[#0071dc] transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span className="font-semibold">Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-600 font-medium">Legal & Compliance</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-bold">Terms of Use</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-[#0071dc] text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Legal Agreement
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium">Version 4.2</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Amarzone Terms of Use
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                Last updated: September 15, 2026. Please read these terms carefully before accessing or purchasing from the Amarzone marketplace.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-full border border-slate-300 shadow-2xs transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Terms</span>
              </button>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0071dc] hover:bg-[#005bb5] text-white font-bold text-xs rounded-full shadow-xs transition-all cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Get Help</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sticky Sidebar + Document Content) */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: Table of Contents (Sticky) */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-6 select-none">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText className="w-4 h-4 text-[#0071dc]" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Table of Contents
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

            {/* Quick Summary Card */}
            <div className="bg-gradient-to-br from-[#170d2f] to-[#251545] text-white rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300">
                  Our Buyer Promise
                </h3>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Enjoy 100% verified authentic items, secure encrypted checkout, and free 90-day returns on eligible merchandise.
              </p>
              <Link
                href="/#flash-deals"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:underline pt-1"
              >
                <span>Browse Marketplace</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>

          {/* Right Main Column: Comprehensive Legal Clauses */}
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

                {/* Plain English Summary Callout */}
                <div className="my-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950 flex items-start gap-2.5">
                  <span className="font-extrabold shrink-0 bg-amber-200/80 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider text-amber-900">
                    In Plain English
                  </span>
                  <p className="font-medium leading-relaxed">{section.summary}</p>
                </div>

                {/* Full Legal Text */}
                <div className="pt-2">{section.content}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermsOfUsePage;
