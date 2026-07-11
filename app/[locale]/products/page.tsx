'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';

// Sample products for demo (replace with Firebase data later)
const sampleProducts: Product[] = [
  {
    id: '1',
    name: {
      'zh-TW': 'LeBron James 2003 Topps Rookie Card',
      en: 'LeBron James 2003 Topps Rookie Card',
    },
    description: {
      'zh-TW': 'LeBron James 2003年 Topps 新秀卡，PSA 9 鑑定等級，限量珍藏。',
      en: 'LeBron James 2003 Topps Rookie Card, PSA 9 graded, limited collector\'s item.',
    },
    price: 25000,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    category: 'cards',
    externalUrl: 'https://tw.bid.yahoo.com/',
    inStock: true,
  },
  {
    id: '2',
    name: {
      'zh-TW': 'Michael Jordan 1986 Fleer Rookie',
      en: 'Michael Jordan 1986 Fleer Rookie',
    },
    description: {
      'zh-TW': 'Michael Jordan 1986年 Fleer 經典新秀卡，PSA 8 鑑定等級。',
      en: 'Michael Jordan 1986 Fleer classic rookie card, PSA 8 graded.',
    },
    price: 150000,
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800',
    category: 'cards',
    externalUrl: 'https://tw.bid.yahoo.com/',
    inStock: true,
  },
  {
    id: '3',
    name: {
      'zh-TW': 'Stephen Curry 2009 Panini Prizm',
      en: 'Stephen Curry 2009 Panini Prizm',
    },
    description: {
      'zh-TW': 'Stephen Curry 2009年 Panini Prizm 新秀卡，PSA 10 完美評級。',
      en: 'Stephen Curry 2009 Panini Prizm rookie card, PSA 10 gem mint.',
    },
    price: 35000,
    image: 'https://images.unsplash.com/photo-1504450758481-7338bbe75c8e?w=800',
    category: 'cards',
    externalUrl: 'https://tw.bid.yahoo.com/',
    inStock: false,
  },
  {
    id: '4',
    name: {
      'zh-TW': '專業卡夾套組 (100入)',
      en: 'Professional Card Holder Set (100pcs)',
    },
    description: {
      'zh-TW': '高品質硬質卡夾，適合收藏級球員卡保護。',
      en: 'High-quality hard card holders, suitable for collector-grade card protection.',
    },
    price: 500,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    category: 'supplies',
    externalUrl: 'https://tw.bid.yahoo.com/',
    inStock: true,
  },
  {
    id: '5',
    name: {
      'zh-TW': 'Team Bag 防塵袋 (200入)',
      en: 'Team Bag Dust Sleeves (200pcs)',
    },
    description: {
      'zh-TW': '防塵防潮保護袋，專為卡夾外層保護設計。',
      en: 'Dust and moisture protection sleeves, designed for card holder outer protection.',
    },
    price: 350,
    image: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=800',
    category: 'supplies',
    externalUrl: 'https://tw.bid.yahoo.com/',
    inStock: true,
  },
  {
    id: '6',
    name: {
      'zh-TW': '球員卡收藏冊 (9格)',
      en: 'Card Collection Album (9-pocket)',
    },
    description: {
      'zh-TW': '專業級球員卡收藏冊，含50頁9格內頁。',
      en: 'Professional card collection album, includes 50 pages of 9-pocket sheets.',
    },
    price: 800,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800',
    category: 'accessories',
    externalUrl: 'https://tw.bid.yahoo.com/',
    inStock: true,
  },
];

export default function ProductsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'cards', 'supplies', 'accessories'] as const;

  const filteredProducts = selectedCategory === 'all'
    ? sampleProducts
    : sampleProducts.filter((product) => product.category === selectedCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-primary-100">{t('subtitle')}</p>
        </div>
      </section>

      {/* Filter & Products */}
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

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
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
