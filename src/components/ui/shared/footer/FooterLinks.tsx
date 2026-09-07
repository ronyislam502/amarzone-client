import React from 'react';
import Link from 'next/link';

interface FooterLinkItem {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLinkItem[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Get to Know Us',
    links: [
      { label: 'All Departments', href: '/' },
      { label: 'Store Directory', href: '/' },
      { label: 'Our Company', href: '/' },
      { label: 'Careers', href: '/' },
      { label: 'News & Newsroom', href: '/' },
    ],
  },
  {
    title: 'Amarzone Services',
    links: [
      { label: 'Pharmacy & Health', href: '/' },
      { label: 'Auto Care Center', href: '/' },
      { label: 'Photo Center', href: '/' },
      { label: 'Money Services', href: '/' },
      { label: 'Protection Plans', href: '/' },
    ],
  },
  {
    title: 'Amarzone+',
    links: [
      { label: 'About Amarzone+', href: '/' },
      { label: 'Free Delivery Benefits', href: '/' },
      { label: 'Member Savings', href: '/' },
      { label: 'Join Amarzone+', href: '/' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Help Center', href: '/' },
      { label: 'Track Your Order', href: '/' },
      { label: 'Returns & Refunds', href: '/' },
      { label: 'Product Recalls', href: '/' },
      { label: 'Contact Us', href: '/' },
    ],
  },
  {
    title: 'In The Spotlight',
    links: [
      { label: 'Spring Savings', href: '/' },
      { label: 'Flash Deals', href: '/' },
      { label: 'Rollbacks', href: '/' },
      { label: 'Clearance', href: '/' },
      { label: 'Gift Cards', href: '/' },
    ],
  },
  {
    title: 'Sell With Us',
    links: [
      { label: 'Sell on Amarzone', href: '/' },
      { label: 'Seller Portal', href: '/' },
      { label: 'Become a Supplier', href: '/' },
      { label: 'Advertise With Us', href: '/' },
    ],
  },
];

const FooterLinks = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-xs text-blue-100 mb-10">
      {FOOTER_COLUMNS.map((col, idx) => (
        <div key={idx}>
          <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-1">
            <span>{col.title}</span>
          </h3>
          <ul className="space-y-2 text-blue-200">
            {col.links.map((link, lIdx) => (
              <li key={lIdx}>
                <Link href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default FooterLinks;
