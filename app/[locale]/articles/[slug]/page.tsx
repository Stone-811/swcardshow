import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Calendar } from 'lucide-react';
import type { Article } from '@/types';
import { locales } from '@/i18n/request';

// Generate static params for all article slugs
export function generateStaticParams() {
  const slugs = ['psa-grading-tutorial-part-1', 'card-packaging-tips'];
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

// Sample article data (replace with Firebase data later)
const sampleArticles: Record<string, Article> = {
  'psa-grading-tutorial-part-1': {
    id: '1',
    title: {
      'zh-TW': 'PSA 鑑定代送教學 (上篇)：申請流程',
      en: 'PSA Grading Tutorial (Part 1): Application Process',
    },
    slug: 'psa-grading-tutorial-part-1',
    excerpt: {
      'zh-TW': '完整的 PSA 球員卡鑑定申請流程教學',
      en: 'Complete PSA sports card grading application tutorial',
    },
    content: {
      'zh-TW': `
## PSA 鑑定代送教學

歡迎來到 SW ProCard 的 PSA 鑑定代送教學系列。在這篇文章中，我們將詳細介紹如何申請 PSA 鑑定服務。

### 步驟一：註冊 PSA 帳號

首先，您需要前往 PSA 官方網站註冊一個帳號。請準備以下資料：
- 有效的電子郵件地址
- 聯絡電話
- 完整的郵寄地址

### 步驟二：選擇鑑定等級

PSA 提供多種鑑定等級，包括：
- **Economy**：最經濟實惠的選擇，適合非急件
- **Regular**：標準處理時間
- **Express**：加快處理
- **Super Express**：最快速的處理方式

### 步驟三：填寫申請表格

在申請表格中，您需要填寫：
1. 卡片的詳細資訊（球員名稱、年份、卡片編號等）
2. 申報價值
3. 是否需要子評分（Subgrades）

### 注意事項

- 請確保卡片狀態良好
- 建議在送件前拍照存檔
- 保留所有運送單據

下一篇文章我們將介紹包裝與運送流程，敬請期待！
      `,
      en: `
## PSA Grading Tutorial

Welcome to SW ProCard's PSA grading tutorial series. In this article, we'll explain the PSA grading application process in detail.

### Step 1: Register a PSA Account

First, you need to register an account on the PSA official website. Please prepare:
- A valid email address
- Contact phone number
- Complete mailing address

### Step 2: Choose Grading Level

PSA offers several grading levels:
- **Economy**: Most affordable option, suitable for non-urgent items
- **Regular**: Standard processing time
- **Express**: Faster processing
- **Super Express**: Fastest processing

### Step 3: Fill Out the Application Form

In the application form, you need to provide:
1. Card details (player name, year, card number, etc.)
2. Declared value
3. Whether you need subgrades

### Important Notes

- Ensure your cards are in good condition
- We recommend photographing cards before submission
- Keep all shipping receipts

In the next article, we'll cover packaging and shipping procedures. Stay tuned!
      `,
    },
    category: 'tutorial',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  'card-packaging-tips': {
    id: '2',
    title: {
      'zh-TW': '球員卡包裝技巧：如何保護您的珍貴收藏',
      en: 'Card Packaging Tips: How to Protect Your Precious Collection',
    },
    slug: 'card-packaging-tips',
    excerpt: {
      'zh-TW': '學習專業的球員卡包裝技巧',
      en: 'Learn professional card packaging techniques',
    },
    content: {
      'zh-TW': `
## 球員卡包裝技巧

保護您珍貴的球員卡收藏，正確的包裝方式至關重要。

### 必備材料

1. **卡夾 (Card Holder)**：硬質卡夾提供基本保護
2. **Team Bag**：防塵保護袋
3. **氣泡袋**：緩衝保護
4. **紙箱**：外層包裝

### 包裝步驟

1. 將卡片放入卡夾
2. 用 Team Bag 包覆卡夾
3. 用氣泡袋包裝
4. 放入適當大小的紙箱
5. 填充緩衝材料

### 小提醒

- 避免使用橡皮筋直接綁卡片
- 不要過度包裝造成擠壓
- 選擇合適大小的紙箱
      `,
      en: `
## Card Packaging Tips

Protecting your precious sports card collection starts with proper packaging.

### Essential Materials

1. **Card Holder**: Hard cases provide basic protection
2. **Team Bag**: Dust protection sleeves
3. **Bubble Wrap**: Cushioning protection
4. **Cardboard Box**: Outer packaging

### Packaging Steps

1. Place the card in a card holder
2. Wrap the holder with a Team Bag
3. Add bubble wrap protection
4. Place in an appropriately sized box
5. Fill with cushioning materials

### Tips

- Avoid using rubber bands directly on cards
- Don't over-pack causing compression
- Choose the right box size
      `,
    },
    category: 'tips',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
};

export default function ArticleDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const t = useTranslations('articles');
  const tCommon = useTranslations('common');
  const localeKey = locale as 'zh-TW' | 'en';

  const article = sampleArticles[slug];

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{tCommon('error')}</h1>
        <Link href={`/${locale}/articles`} className="text-primary-600 hover:underline">
          {tCommon('backToHome')}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 w-full">
        <Image
          src={article.image}
          alt={article.title[localeKey]}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          href={`/${locale}/articles`}
          className="inline-flex items-center text-primary-600 hover:underline mb-6"
        >
          <ArrowLeft size={18} className="mr-1" />
          {locale === 'zh-TW' ? '返回文章列表' : 'Back to Articles'}
        </Link>

        {/* Category & Date */}
        <div className="flex items-center gap-4 mb-4">
          <span className="inline-block px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-full">
            {t(`categories.${article.category}`)}
          </span>
          <span className="flex items-center text-gray-500 text-sm">
            <Calendar size={16} className="mr-1" />
            {article.createdAt.toLocaleDateString(locale)}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          {article.title[localeKey]}
        </h1>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {article.content[localeKey].split('\n').map((line, index) => {
            if (line.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  {line.replace('## ', '')}
                </h2>
              );
            }
            if (line.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  {line.replace('### ', '')}
                </h3>
              );
            }
            if (line.startsWith('- ')) {
              return (
                <li key={index} className="text-gray-700 ml-4">
                  {line.replace('- ', '')}
                </li>
              );
            }
            if (line.match(/^\d+\. /)) {
              return (
                <li key={index} className="text-gray-700 ml-4 list-decimal">
                  {line.replace(/^\d+\. /, '')}
                </li>
              );
            }
            if (line.trim() === '') {
              return <br key={index} />;
            }
            return (
              <p key={index} className="text-gray-700 mb-4">
                {line}
              </p>
            );
          })}
        </div>
      </article>
    </div>
  );
}
