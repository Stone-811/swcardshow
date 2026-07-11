import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('about');

  const services = t.raw('services.items') as string[];

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-stone-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
            {locale === 'zh-TW' ? '關於我們' : 'About Us'}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            {t('title')}
          </h1>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              {t('intro.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('intro.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-6">
              {locale === 'zh-TW' ? '我們的使命' : 'Our Mission'}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              {t('mission.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('mission.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-6">
              {locale === 'zh-TW' ? '服務項目' : 'Our Services'}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
              {t('services.title')}
            </h2>
          </div>
          <div className="grid gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-lg text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                {locale === 'zh-TW' ? '專業認證' : 'Professional Certification'}
              </h3>
              <p className="text-gray-600">
                {locale === 'zh-TW' ? '與 PSA 合作的專業鑑定服務' : 'Professional grading service with PSA'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                {locale === 'zh-TW' ? '安全保障' : 'Safety Guaranteed'}
              </h3>
              <p className="text-gray-600">
                {locale === 'zh-TW' ? '完善的保險與追蹤機制' : 'Comprehensive insurance and tracking'}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                {locale === 'zh-TW' ? '國際運送' : 'International Shipping'}
              </h3>
              <p className="text-gray-600">
                {locale === 'zh-TW' ? 'FedEx 快速國際運送服務' : 'FedEx fast international shipping'}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                {locale === 'zh-TW' ? '專人服務' : 'Personal Service'}
              </h3>
              <p className="text-gray-600">
                {locale === 'zh-TW' ? '一對一專人諮詢服務' : 'One-on-one consultation service'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
