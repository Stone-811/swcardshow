# SW ProCard - Sports Card Grading Website

Local version of swpcg.com - a sports card grading and authentication website.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **i18n**: next-intl (Traditional Chinese / English)
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Scraper**: Python (requests, BeautifulSoup)

## Commands

```bash
# Website
npm install         # Install dependencies
npm run dev         # Development server (http://localhost:3000)
npm run build       # Production build (static export)
npm run start       # Start production server

# Deployment
npx firebase-tools deploy --only hosting

# Scraper
cd scraper
pip install -r requirements.txt
python ebay_scraper.py
```

## Project Structure

```
├── app/
│   ├── [locale]/           # i18n routes (zh-TW, en)
│   │   ├── page.tsx        # Home
│   │   ├── about/          # About page
│   │   ├── articles/       # Articles list & detail
│   │   ├── products/       # Products display
│   │   └── contact/        # Contact form
│   ├── api/contact/        # Contact form API
│   └── layout.tsx          # Root layout
│
├── components/             # React components
│   ├── Header.tsx          # Navigation + language switcher
│   ├── Footer.tsx
│   ├── ArticleCard.tsx
│   ├── ProductCard.tsx
│   └── ContactForm.tsx
│
├── scraper/                # eBay price scraper
│   ├── ebay_scraper.py     # Main scraper
│   ├── config.py           # API credentials (gitignored)
│   └── requirements.txt
│
├── messages/               # Translation files
│   ├── zh-TW.json
│   └── en.json
│
├── i18n/request.ts         # i18n configuration
├── lib/firebase.ts         # Firebase config
├── firebase.json           # Firebase hosting config
└── .firebaserc             # Firebase project config
```

## Routes

| Route | Description |
|-------|-------------|
| `/zh-TW` or `/en` | Home page |
| `/[locale]/about` | About SW ProCard |
| `/[locale]/articles` | Article list with filter |
| `/[locale]/articles/[slug]` | Article detail |
| `/[locale]/products` | Products (links to Yahoo) |
| `/[locale]/contact` | Contact form |

## Deployment

### Firebase Hosting

```bash
# Build and deploy
npm run build
npx firebase-tools deploy --only hosting
```

**Live URL**: https://swcardshow.web.app

### GitHub Repository

https://github.com/Stone-811/swcardshow

## eBay Scraper

爬取 eBay 球卡交易資料（已售出 + 目前上架）。

### Setup

```bash
cd scraper
cp config.example.py config.py
# Edit config.py with your eBay API credentials
pip install -r requirements.txt
```

### Usage

```python
from ebay_scraper import scrape_sold_items, scrape_listings

# 爬取已售出商品
sold = scrape_sold_items("PSA 10 Jordan", max_pages=5)

# 爬取目前上架商品
listings = scrape_listings("PSA 10 Jordan", limit=100)
```

### Features

- eBay Browse API (上架商品)
- Web scraping (已售出商品)
- Anti-scraping: User-Agent 輪換、隨機延遲、Proxy 支援
- 輸出 CSV/JSON

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=xxx
```

## Adding Content

- **Articles**: Edit `sampleArticles` in page files
- **Products**: Edit `sampleProducts` in `products/page.tsx`
- **Translations**: Edit `messages/zh-TW.json` and `messages/en.json`

## Key Features

- Bilingual support (zh-TW/en) with URL-based routing
- Responsive design (mobile-first)
- Static site generation for fast loading
- Contact form with API endpoint
- eBay price data scraping
