# SW ProCard - Sports Card Grading Website

Local version of swpcg.com - a sports card grading and authentication website.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **i18n**: next-intl (Traditional Chinese / English)
- **Database**: Firebase Firestore (optional)
- **Icons**: Lucide React

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
app/
├── [locale]/           # i18n routes (zh-TW, en)
│   ├── page.tsx        # Home
│   ├── about/          # About page
│   ├── articles/       # Articles list & detail
│   ├── products/       # Products display
│   └── contact/        # Contact form
├── api/contact/        # Contact form API
└── layout.tsx          # Root layout

components/             # React components
├── Header.tsx          # Navigation + language switcher
├── Footer.tsx          # Footer
├── ArticleCard.tsx     # Article preview card
├── ProductCard.tsx     # Product card
└── ContactForm.tsx     # Contact form

messages/               # Translation files
├── zh-TW.json          # Traditional Chinese
└── en.json             # English

i18n/request.ts         # i18n configuration
lib/firebase.ts         # Firebase config
types/index.ts          # TypeScript types
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

## Firebase Setup (Optional)

1. Create project at https://console.firebase.google.com
2. Copy `.env.local.example` to `.env.local`
3. Add Firebase credentials to `.env.local`

## Adding Content

- **Articles**: Edit `sampleArticles` in `app/[locale]/page.tsx` and `app/[locale]/articles/page.tsx`
- **Products**: Edit `sampleProducts` in `app/[locale]/products/page.tsx`
- **Translations**: Edit `messages/zh-TW.json` and `messages/en.json`

## Key Features

- Bilingual support (zh-TW/en) with URL-based routing
- Responsive design (mobile-first)
- Static site generation for fast loading
- Contact form with API endpoint
- Category filtering for articles and products
