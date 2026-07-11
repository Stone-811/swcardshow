'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  locale: string;
}

export default function ArticleCard({ article, locale }: ArticleCardProps) {
  const t = useTranslations('articles');
  const localeKey = locale as 'zh-TW' | 'en';

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link href={`/${locale}/articles/${article.slug}`} className="block">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={article.image || '/images/placeholder.jpg'}
            alt={article.title[localeKey]}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-4">
            {t(`categories.${article.category}`)}
          </span>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
            {article.title[localeKey]}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {article.excerpt[localeKey]}
          </p>

          {/* Read more */}
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 group-hover:text-amber-600 transition-colors">
            {t('readMore')}
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}
