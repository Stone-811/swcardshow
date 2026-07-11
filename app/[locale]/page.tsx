import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import ArticleCard from '@/components/ArticleCard';
import type { Article } from '@/types';

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
];

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('home');

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-stone-200/50 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {locale === 'zh-TW' ? '專業鑑定服務' : 'Professional Grading'}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-tight mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              {t('hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12">
              {t('hero.description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('hero.cta')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                {t('hero.ctaProducts')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-6">
              {locale === 'zh-TW' ? '服務項目' : 'Services'}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              {t('services.title')}
            </h2>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Service 1 */}
            <div className="group p-8 md:p-10 bg-stone-50 rounded-3xl hover:bg-stone-100 transition-colors duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                {t('services.grading.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('services.grading.description')}
              </p>
            </div>

            {/* Service 2 */}
            <div className="group p-8 md:p-10 bg-stone-50 rounded-3xl hover:bg-stone-100 transition-colors duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                {t('services.authentication.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('services.authentication.description')}
              </p>
            </div>

            {/* Service 3 */}
            <div className="group p-8 md:p-10 bg-stone-50 rounded-3xl hover:bg-stone-100 transition-colors duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                {t('services.consultation.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('services.consultation.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-24 md:py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wider mb-4">
                {locale === 'zh-TW' ? '最新資訊' : 'Latest News'}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                {t('featured.title')}
              </h2>
            </div>
            <Link
              href={`/${locale}/articles`}
              className="inline-flex items-center gap-2 text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
              {t('featured.viewAll')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sampleArticles.map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-3xl p-12 md:p-20 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              {locale === 'zh-TW' ? '準備好為您的收藏增值了嗎？' : 'Ready to elevate your collection?'}
            </h2>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              {locale === 'zh-TW'
                ? '立即聯繫我們，開始您的專業鑑定之旅。'
                : 'Contact us today to start your professional grading journey.'}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-gray-900 font-bold rounded-full hover:bg-amber-400 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {locale === 'zh-TW' ? '立即聯繫' : 'Get in Touch'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
