"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  ArrowRight,
  CheckCircle2,
  Heart,
  Globe2,
  Users,
  Sparkles,
  Award,
  Zap,
  Coffee,
  ShieldCheck,
  ChevronDown,
  X,
  Send,
  Home,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";

interface JobListing {
  id: string;
  title: string;
  department: "Engineering" | "Product & Design" | "Operations & Logistics" | "Customer Care" | "Marketing";
  location: string;
  type: "Full-Time" | "Contract";
  workplace: "Remote" | "Hybrid" | "On-Site";
  salary: string;
  experience: string;
  description: string;
  tags: string[];
}

const JOB_LISTINGS: JobListing[] = [
  {
    id: "job-1",
    title: "Senior Full-Stack Engineer (Next.js & Microservices)",
    department: "Engineering",
    location: "Remote / Hybrid (New York, NY)",
    type: "Full-Time",
    workplace: "Hybrid",
    salary: "$145,000 - $185,000 + Equity",
    experience: "5+ years",
    description:
      "Architect high-velocity marketplace web applications, optimize serverless edge rendering, and enhance customer cart checkout workflows.",
    tags: ["React 19", "Next.js", "TypeScript", "Node.js", "Redis"],
  },
  {
    id: "job-2",
    title: "Principal UX/UI Designer - Marketplace Experience",
    department: "Product & Design",
    location: "Remote (US / Canada)",
    type: "Full-Time",
    workplace: "Remote",
    salary: "$140,000 - $175,000 + Equity",
    experience: "6+ years",
    description:
      "Drive customer-centric design systems, checkout flow optimization, and responsive multi-device product detail interfaces across Amarzone.",
    tags: ["Figma", "Design Systems", "Prototyping", "User Research"],
  },
  {
    id: "job-3",
    title: "Director of Supply Chain & Fulfillment Logistics",
    department: "Operations & Logistics",
    location: "Chicago, IL / Dallas, TX",
    type: "Full-Time",
    workplace: "Hybrid",
    salary: "$160,000 - $210,000 + Bonus",
    experience: "8+ years",
    description:
      "Scale our regional distribution centers, optimize multi-vendor 2-day delivery SLAs, and partner with regional transportation carriers.",
    tags: ["Logistics", "Distribution", "Inventory Management", "WMS"],
  },
  {
    id: "job-4",
    title: "Data Platform Engineer - Search & Recommendations",
    department: "Engineering",
    location: "Seattle, WA / Remote",
    type: "Full-Time",
    workplace: "Remote",
    salary: "$150,000 - $190,000 + Equity",
    experience: "4+ years",
    description:
      "Build real-time personalization algorithms, vector search infrastructure, and collaborative filtering pipelines handling millions of daily queries.",
    tags: ["Python", "Apache Kafka", "Elasticsearch", "PostgreSQL"],
  },
  {
    id: "job-5",
    title: "Lead Technical Product Manager - Merchant Tools",
    department: "Product & Design",
    location: "Austin, TX / Remote",
    type: "Full-Time",
    workplace: "Remote",
    salary: "$135,000 - $170,000",
    experience: "5+ years",
    description:
      "Empower thousands of independent merchants with real-time analytics, inventory forecasting tools, and automated catalog onboarding.",
    tags: ["Roadmap", "B2B SaaS", "APIs", "Data Analytics"],
  },
  {
    id: "job-6",
    title: "Customer Escalations & Trust Specialist",
    department: "Customer Care",
    location: "Remote (Worldwide)",
    type: "Full-Time",
    workplace: "Remote",
    salary: "$55,000 - $72,000",
    experience: "2+ years",
    description:
      "Serve as the frontline advocate for buyer and vendor resolutions, upholding our 90-day return promise and buyer protection guarantees.",
    tags: ["Zendesk", "Dispute Resolution", "Customer Advocacy"],
  },
  {
    id: "job-7",
    title: "Senior Growth Marketing Manager",
    department: "Marketing",
    location: "New York, NY / Remote",
    type: "Full-Time",
    workplace: "Hybrid",
    salary: "$125,000 - $155,000",
    experience: "4+ years",
    description:
      "Scale paid customer acquisition, retention lifecycle campaigns, and seasonal promotions like Flash Deals and Rollback events.",
    tags: ["Paid Social", "SEO", "Lifecycle", "Conversion Optimization"],
  },
  {
    id: "job-8",
    title: "Cloud Infrastructure & DevOps Engineer",
    department: "Engineering",
    location: "Remote (US)",
    type: "Full-Time",
    workplace: "Remote",
    salary: "$140,000 - $180,000",
    experience: "4+ years",
    description:
      "Manage highly scalable multi-region AWS/Kubernetes infrastructure with 99.99% uptime for peak seasonal traffic spikes.",
    tags: ["Kubernetes", "Terraform", "AWS", "Docker", "CI/CD"],
  },
];

export const CareersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>("All");

  // Application Modal state
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobListing | null>(null);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [candidateResume, setCandidateResume] = useState("");
  const [candidatePortfolio, setCandidatePortfolio] = useState("");
  const [candidateNote, setCandidateNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ Accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return JOB_LISTINGS.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDept = selectedDept === "All" || job.department === selectedDept;
      const matchesWorkplace = selectedWorkplace === "All" || job.workplace === selectedWorkplace;

      return matchesSearch && matchesDept && matchesWorkplace;
    });
  }, [searchQuery, selectedDept, selectedWorkplace]);

  const handleApplyClick = (job: JobListing) => {
    setSelectedJobForModal(job);
  };

  const handleCloseModal = () => {
    setSelectedJobForModal(null);
    setCandidateName("");
    setCandidateEmail("");
    setCandidatePhone("");
    setCandidateResume("");
    setCandidatePortfolio("");
    setCandidateNote("");
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidateEmail.trim()) {
      toast.error("Please provide your name and email address.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Application for "${selectedJobForModal?.title}" submitted successfully! Our recruiting team will review your profile.`, {
        position: "bottom-right",
        autoClose: 3500,
      });
      handleCloseModal();
    }, 900);
  };

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
            <span className="text-slate-900 font-bold">Careers & Opportunities</span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#170d2f] via-[#211244] to-[#120925] text-white py-16 sm:py-24">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-black uppercase tracking-wider text-amber-300">
              <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>We Are Hiring Globally</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Build the Future of <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Modern Commerce
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Join a high-velocity team transforming digital retail, multi-vendor marketplace logistics, and everyday value for millions of households worldwide.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">12,000+</p>
                <p className="text-xs text-slate-400 font-medium">Team Members</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-amber-300">35+</p>
                <p className="text-xs text-slate-400 font-medium">Countries Represented</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">94%</p>
                <p className="text-xs text-slate-400 font-medium">Retention Rate</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-sky-400">4.8 ★</p>
                <p className="text-xs text-slate-400 font-medium">Glassdoor Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 3. Job Search Engine Bar */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border border-slate-200/90 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Keyword Search */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, skill, or keyword (e.g., React, Design, Logistics)..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0071dc] focus:bg-white transition-all"
            />
          </div>

          {/* Department Select */}
          <div className="sm:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0071dc] focus:bg-white transition-all cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product & Design">Product & Design</option>
              <option value="Operations & Logistics">Operations & Logistics</option>
              <option value="Customer Care">Customer Care</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          {/* Workplace Type */}
          <div className="sm:col-span-3">
            <select
              value={selectedWorkplace}
              onChange={(e) => setSelectedWorkplace(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0071dc] focus:bg-white transition-all cursor-pointer"
            >
              <option value="All">Any Workplace (Remote / Hybrid)</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-Site">On-Site</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Open Positions Section */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-12 sm:py-16 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Open Roles</span>
              <span className="text-xs font-bold text-[#0071dc] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                {filteredJobs.length} Available
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find your next career chapter across our worldwide teams
            </p>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {["All", "Engineering", "Product & Design", "Operations & Logistics", "Customer Care", "Marketing"].map(
              (dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDept === dept
                      ? "bg-[#0071dc] text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {dept}
                </button>
              )
            )}
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Details */}
              <div className="space-y-2.5 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0071dc] bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {job.department}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {job.workplace}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {job.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {job.description}
                </p>

                {/* Tags and Compensation */}
                <div className="flex items-center gap-3 flex-wrap pt-1">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salary}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Exp: {job.experience}
                  </span>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Action */}
              <div className="shrink-0 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleApplyClick(job)}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0071dc] hover:bg-[#005bb5] active:bg-[#004f9a] text-white font-black text-xs sm:text-sm rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Empty fallback */}
          {filteredJobs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No open positions match your search criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search terms or clearing department filters to see all available roles.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDept("All");
                  setSelectedWorkplace("All");
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Company Culture & Values */}
      <section className="bg-white border-y border-slate-200/80 py-16 sm:py-20">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#0071dc] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Our Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Values That Drive Amarzone
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              We empower people, move with extraordinary velocity, and put everyday shoppers and sellers first.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl border border-slate-200/90 bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0071dc] flex items-center justify-center">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <h3 className="font-black text-base text-slate-900">Customer Obsession</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We begin with customer trust and work backwards. Every product feature, price drop, and return policy is crafted with consumer empathy.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/90 bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <h3 className="font-black text-base text-slate-900">Velocity & Ownership</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Speed matters in retail. We value calculated risk-taking, lean decision making, and treating company resources as our own.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/90 bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-900">Inclusion & Belonging</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diverse backgrounds yield the highest creativity. We celebrate unique perspectives and cultivate an environment where everyone can flourish.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/90 bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-900">Sustainable Scale</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                As we grow, so does our responsibility. We invest in eco-friendly packaging, optimized transit routes, and zero-carbon fulfillment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Benefits & Total Rewards */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-16 sm:py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Total Rewards
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Perks Built for Your Life & Future
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Comprehensive compensation, health wellness, and personal development packages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <ShieldCheck className="w-6 h-6 text-[#0071dc]" />
            <h4 className="font-black text-slate-900 text-sm">100% Comprehensive Health</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Medical, dental, vision, mental health counseling, and family planning covered for you and dependents.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <Clock className="w-6 h-6 text-emerald-600" />
            <h4 className="font-black text-slate-900 text-sm">Flexible & Remote First</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlimited paid time off (PTO), flexible core hours, and 16 weeks of fully paid parental leave.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <TrendingUp className="w-6 h-6 text-amber-600" />
            <h4 className="font-black text-slate-900 text-sm">Wealth & 401(k) Match</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Competitive base salaries, meaningful stock equity grants, and dollar-for-dollar 6% 401(k) matching.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h4 className="font-black text-slate-900 text-sm">20% Store Employee Discount</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Substantial discounts across Amarzone merchandise catalog, plus free lifetime Amarzone+ delivery perks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <Award className="w-6 h-6 text-indigo-600" />
            <h4 className="font-black text-slate-900 text-sm">$3,000 Learning Stipend</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Annual budget for conferences, certifications, books, and courses to accelerate your professional craft.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <Coffee className="w-6 h-6 text-rose-600" />
            <h4 className="font-black text-slate-900 text-sm">Home Office Budget</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              $1,200 initial stipend to set up your ergonomic workspace, 4K monitor, and high-speed home connectivity.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Hiring Process Timeline */}
      <section className="bg-slate-100/60 border-y border-slate-200/80 py-16 sm:py-20">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Our 5-Step Hiring Process
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Transparent, communicative, and respectful of your time from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { step: "01", title: "Apply Online", desc: "Submit your resume and portfolio in under 2 minutes." },
              { step: "02", title: "Recruiter Intro", desc: "30-minute casual conversation regarding expectations and role alignment." },
              { step: "03", title: "Skills Deep Dive", desc: "Technical or domain review evaluating practical problem-solving." },
              { step: "04", title: "Team Culture Chat", desc: "Meet cross-functional teammates and leadership." },
              { step: "05", title: "Welcome Offer!", desc: "Clear compensation details, benefits walkthrough, and onboarding." },
            ].map((st, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2 text-center">
                <span className="text-2xl font-black text-[#0071dc] block">{st.step}</span>
                <h4 className="font-bold text-sm text-slate-900">{st.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Candidate FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to know about working at Amarzone
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Can I work 100% remotely from anywhere?",
              a: "Yes! Many of our Engineering, Product, and Customer Care roles are remote-first. We support employees across the United States, Canada, Europe, and Asia with localized payroll entities.",
            },
            {
              q: "What does the technical interview look like?",
              a: "We do not believe in memorizing obscure whiteboard puzzles. We review real-world architectural scenarios, code readability, and collaborative problem-solving similar to our everyday codebase.",
            },
            {
              q: "Do you offer internship or new-graduate programs?",
              a: "Yes! We run annual summer undergraduate and master's internships in Software Engineering, Data Science, and Operations Management with dedicated mentors.",
            },
            {
              q: "Does Amarzone provide visa sponsorship?",
              a: "Yes, we sponsor H-1B transfers, O-1, TN, and green card filings for eligible specialized technical roles.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedFaq === idx ? "rotate-180 text-[#0071dc]" : ""
                  }`}
                />
              </button>
              {expandedFaq === idx && (
                <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Interactive Job Application Modal */}
      {selectedJobForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0071dc] bg-blue-50 px-2 py-0.5 rounded-full">
                  {selectedJobForModal.department}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  Apply for {selectedJobForModal.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedJobForModal.location} • {selectedJobForModal.salary}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmitApplication} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0071dc] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="alex@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0071dc] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0071dc] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Resume / CV Link or Cloud Drive URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={candidateResume}
                  onChange={(e) => setCandidateResume(e.target.value)}
                  placeholder="https://drive.google.com/your-resume.pdf"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0071dc] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  LinkedIn or Portfolio URL
                </label>
                <input
                  type="url"
                  value={candidatePortfolio}
                  onChange={(e) => setCandidatePortfolio(e.target.value)}
                  placeholder="https://linkedin.com/in/yourname or github.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0071dc] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Brief Introduction & Why Amarzone?
                </label>
                <textarea
                  rows={3}
                  value={candidateNote}
                  onChange={(e) => setCandidateNote(e.target.value)}
                  placeholder="Tell us about what you're excited to build..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0071dc] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0071dc] hover:bg-[#005bb5] text-white font-black text-xs rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Submitting..." : "Submit Application"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default CareersPage;
