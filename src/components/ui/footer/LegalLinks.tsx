import React from 'react';
import Link from 'next/link';

const LEGAL_LINKS = [
  { label: 'All Departments', href: '/' },
  { label: 'Store Directory', href: '/' },
  { label: 'Careers', href: '/' },
  { label: 'Our Company', href: '/' },
  { label: 'Sell on Amarzone', href: '/' },
  { label: 'Help', href: '/' },
  { label: 'COVID-19 Info', href: '/' },
  { label: 'Terms of Use', href: '/' },
  { label: 'Privacy & Security', href: '/' },
  { label: 'CA Privacy Rights', href: '/' },
  { label: 'Your Privacy Choices', href: '/' },
];

const LegalLinks = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-blue-200 text-center mb-6">
      {LEGAL_LINKS.map((link, idx) => (
        <React.Fragment key={idx}>
          <Link href={link.href} className="hover:underline">
            {link.label}
          </Link>
          {idx < LEGAL_LINKS.length - 1 && <span>•</span>}
        </React.Fragment>
      ))}
    </div>
  );
}


export default LegalLinks;