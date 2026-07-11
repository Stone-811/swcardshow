'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  locale: string;
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations('products');
  const localeKey = locale as 'zh-TW' | 'en';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={product.image || '/images/placeholder.jpg'}
          alt={product.name[localeKey]}
          fill
          className="object-cover"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">
              {locale === 'zh-TW' ? '已售出' : 'Sold Out'}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <span className="inline-block px-2 py-1 text-xs font-medium text-accent-600 bg-accent-50 rounded mb-2">
          {t(`categories.${product.category}`)}
        </span>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name[localeKey]}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description[localeKey]}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">
            NT$ {product.price.toLocaleString()}
          </span>
          {product.inStock && (
            <a
              href={product.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm"
            >
              {t('buyNow')}
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
