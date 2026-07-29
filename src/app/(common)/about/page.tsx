import React from "react";
import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutStats from "@/components/about/AboutStats";
import AboutMissionVision from "@/components/about/AboutMissionVision";
import AboutValues from "@/components/about/AboutValues";
import AboutTimeline from "@/components/about/AboutTimeline";
import AboutLeadership from "@/components/about/AboutLeadership";
import AboutGuarantees from "@/components/about/AboutGuarantees";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About Us - Amarzone | Premier E-Commerce Marketplace",
  description:
    "Discover Amarzone's story, mission, core values, leadership, and vision for empowering seamless e-commerce experiences worldwide.",
  keywords: [
    "About Amarzone",
    "E-commerce Marketplace",
    "Online Shopping",
    "Verified Merchants",
    "Amarzone Mission",
  ],
};

export default function AboutPage() {
  return (
    <main id="about-page" className="min-h-screen bg-white dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100">
      {/* 1. Hero Section */}
      <AboutHero />

      {/* 2. Platform Stats Counter */}
      <AboutStats />

      {/* 3. Mission & Vision */}
      <AboutMissionVision />

      {/* 4. Core Values Grid */}
      <AboutValues />

      {/* 5. Journey & Milestones Timeline */}
      <AboutTimeline />

      {/* 6. Leadership & Team */}
      <AboutLeadership />

      {/* 7. Guarantees & Buyer Trust */}
      <AboutGuarantees />

      {/* 8. Call to Action */}
      <AboutCTA />
    </main>
  );
}
