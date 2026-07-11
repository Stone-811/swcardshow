'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`}>
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
                SW ProCard
              </span>
            </Link>
            <p className="mt-4 text-gray-400 leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('links')}</h4>
            <ul className="space-y-3">
              {[
                { href: `/${locale}`, label: tNav('home') },
                { href: `/${locale}/about`, label: tNav('about') },
                { href: `/${locale}/articles`, label: tNav('articles') },
                { href: `/${locale}/products`, label: tNav('products') },
                { href: `/${locale}/contact`, label: tNav('contact') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('contact')}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:tingo8320@gmail.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-amber-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  tingo8320@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://tw.bid.yahoo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-amber-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Yahoo {locale === 'zh-TW' ? '拍賣商店' : 'Auction Store'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          &copy; {currentYear} SW ProCard. {t('copyright')}.
        </div>
      </div>
    </footer>
  );
}
