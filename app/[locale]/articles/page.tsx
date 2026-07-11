'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ArticleCard from '@/components/ArticleCard';
import type { Article } from '@/types';

// Sample articles for demo (replace with Firebase data later)
const sampleArticles: Article[] = [
  {
    id: '1',
    title: {
      'zh-TW': 'PSA 鑑定代送教學 (上篇)：申請流程',
      en: 'PSA Grading Tutorial (Part 1): Application Process',
    },
    slug: 'psa-grading-tutorial-part-1',
    excerpt: {
      'zh-TW': '完整的 PSA 球員卡鑑定申請流程教學，從註冊帳號到填寫申請表格的詳細步驟說明。',
      en: 'Complete PSA sports card grading application tutorial, from account registration to filling out the application form.',
    },
    content: { 'zh-TW': '', en: '' },
    category: 'tutorial',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: {
      'zh-TW': '球員卡包裝技巧：如何保護您的珍貴收藏',
      en: 'Card Packaging Tips: How to Protect Your Precious Collection',
    },
    slug: 'card-packaging-tips',
    excerpt: {
      'zh-TW': '學習專業的球員卡包裝技巧，確保您的卡片在運送過程中得到最佳保護。',
      en: 'Learn professional card packaging techniques to ensure your cards get the best protection during shipping.',
    },
    content: { 'zh-TW': '', en: '' },
    category: 'tips',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: {
      'zh-TW': '2024 球員卡市場趨勢分析',
      en: '2024 Sports Card Market Trend Analysis',
    },
    slug: 'market-trend-2024',
    excerpt: {
      'zh-TW': '深入分析 2024 年球員卡市場的最新趨勢，了解哪些卡片最具投資價值。',
      en: 'In-depth analysis of the latest trends in the 2024 sports card market, learn which cards have the best investment value.',
    },
    content: { 'zh-TW': '', en: '' },
    category: 'news',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: {
      'zh-TW': 'PSA 鑑定代送教學 (下篇)：包裝與運送',
      en: 'PSA Grading Tutorial (Part 2): Packaging and Shipping',
    },
    slug: 'psa-grading-tutorial-part-2',
    excerpt: {
      'zh-TW': '詳細的包裝指南與 FedEx 運送流程說明，確保您的卡片安全送達 PSA。',
      en: 'Detailed packaging guide and FedEx shipping process to ensure your cards arrive safely at PSA.',
    },
    content: { 'zh-TW': '', en: '' },
    category: 'tutorial',
    image: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=800',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    title: {
      'zh-TW': '如何辨別球員卡真偽',
      en: 'How to Identify Authentic Sports Cards',
    },
    slug: 'identify-authentic-cards',
    excerpt: {
      'zh-TW': '學習辨別球員卡真偽的關鍵技巧，保護您的收藏免受假卡侵害。',
      en: 'Learn key techniques to identify authentic sports cards and protect your collection from counterfeits.',
    },
    content: { 'zh-TW': '', en: '' },
    category: 'tips',
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ArticlesPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('articles');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'tutorial', 'news', 'tips'] as const;

  const filteredArticles = selectedCategory === 'all'
    ? sampleArticles
    : sampleArticles.filter((article) => article.category === selectedCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-primary-100">{t('subtitle')}</p>
        </div>
      </section>

      {/* Filter & Articles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">{t('empty')}</p>
          )}
        </div>
      </section>
    </div>
  );
}
