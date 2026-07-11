export interface Article {
  id: string;
  title: {
    'zh-TW': string;
    en: string;
  };
  slug: string;
  excerpt: {
    'zh-TW': string;
    en: string;
  };
  content: {
    'zh-TW': string;
    en: string;
  };
  category: 'tutorial' | 'news' | 'tips';
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: {
    'zh-TW': string;
    en: string;
  };
  description: {
    'zh-TW': string;
    en: string;
  };
  price: number;
  image: string;
  category: 'cards' | 'supplies' | 'accessories';
  externalUrl: string;
  inStock: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  read: boolean;
}
