import React from "react";
import { Globe, Mail, Share2 } from "lucide-react";

const teamMembers = [
  {
    name: "Rony Islam",
    role: "Founder & Chief Executive Officer",
    bio: "Passionate e-commerce pioneer dedicated to scaling digital commerce infrastructure and empowering small merchants.",
    initials: "RI",
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    name: "Sarah Jenkins",
    role: "VP of Product Strategy",
    bio: "Former Fintech product leader crafting intuitive user experiences and AI-assisted shopping tools.",
    initials: "SJ",
    gradient: "from-purple-600 to-pink-700",
  },
  {
    name: "David Chen",
    role: "Head of Global Logistics",
    bio: "Logistics strategist optimizing supply chain routes and fulfillment speeds across 120+ cities.",
    initials: "DC",
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    name: "Elena Rostova",
    role: "Director of Merchant Growth",
    bio: "Empowering 50,000+ vendors with growth playbooks, analytics, and marketing support.",
    initials: "ER",
    gradient: "from-amber-500 to-orange-600",
  },
];

export default function AboutLeadership() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            The Team Behind Amarzone
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Meet Our Leadership
          </p>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            A diverse group of technologists, logistics experts, and retail visionaries committed to your shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col text-center items-center"
            >
              {/* Avatar placeholder with colorful gradient & initials */}
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-tr ${member.gradient} text-white font-black text-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-105 transition-transform duration-300 ring-4 ring-slate-100 dark:ring-slate-700`}
              >
                {member.initials}
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {member.name}
              </h3>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                {member.role}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                {member.bio}
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3 text-slate-400">
                <a
                  href="#profile"
                  aria-label={`${member.name} Web Profile`}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="#email"
                  aria-label={`Contact ${member.name}`}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href="#share"
                  aria-label={`Share ${member.name} Profile`}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
