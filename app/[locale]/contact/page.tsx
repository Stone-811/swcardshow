import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Mail, ExternalLink, MapPin } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('contact');

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-primary-100">{t('subtitle')}</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {locale === 'zh-TW' ? '傳送訊息' : 'Send a Message'}
              </h2>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('info.title')}</h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('info.email')}</h3>
                    <a
                      href="mailto:tingo8320@gmail.com"
                      className="text-primary-600 hover:underline"
                    >
                      tingo8320@gmail.com
                    </a>
                  </div>
                </div>

                {/* Store */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                    <ExternalLink size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('info.store')}</h3>
                    <a
                      href="https://tw.bid.yahoo.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {locale === 'zh-TW' ? '前往 Yahoo 拍賣商店' : 'Visit Yahoo Auction Store'}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {locale === 'zh-TW' ? '服務地區' : 'Service Area'}
                    </h3>
                    <p className="text-gray-600">
                      {locale === 'zh-TW' ? '台灣全區' : 'All of Taiwan'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {locale === 'zh-TW' ? '營業時間' : 'Business Hours'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'zh-TW'
                    ? '週一至週五：09:00 - 18:00'
                    : 'Monday - Friday: 09:00 - 18:00'}
                </p>
                <p className="text-gray-600">
                  {locale === 'zh-TW'
                    ? '週六、週日：預約服務'
                    : 'Saturday - Sunday: By Appointment'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
