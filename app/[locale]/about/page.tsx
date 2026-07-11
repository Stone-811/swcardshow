import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Award, Shield, Truck, MessageCircle, CheckCircle } from 'lucide-react';

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('about');

  const services = t.raw('services.items') as string[];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('intro.title')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{t('intro.description')}</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('mission.title')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{t('mission.description')}</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('services.title')}</h2>
          <div className="grid gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                  <CheckCircle size={20} />
                </div>
                <span className="text-lg text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Award size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === 'zh-TW' ? '專業認證' : 'Professional Certification'}
              </h3>
              <p className="text-gray-600">
                {locale === 'zh-TW' ? '與 PSA 合作的專業鑑定服務' : 'Professional grading service with PSA'}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Shield size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === 'zh-TW' ? '安全保障' : 'Safety Guaranteed'}
              </h3>
              <p className="text-gray-600">
                {locale === 'zh-TW' ? '完善的保險與追蹤機制' : 'Comprehensive insurance and tracking'}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Truck size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === 'zh-TW' ? '國際運送' : 'International Shipping'}
              </h3>
              <p className="text-gray-600">
                {locale === 'zh-TW' ? 'FedEx 快速國際運送服務' : 'FedEx fast international shipping'}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
