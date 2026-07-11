# SW ProCard 球卡鑑定網站

專業球員卡鑑定代送服務網站，提供 PSA 鑑定代送、球卡知識文章、商品展示等功能。

**Live Demo**: https://swcardshow.web.app

## 功能特色

- 🌐 **雙語支援** - 繁體中文 / English
- 📱 **響應式設計** - 支援手機、平板、桌面
- 🔥 **Firebase 託管** - 快速穩定的靜態網站
- 📊 **eBay 爬蟲** - 自動爬取球卡成交價格

## 快速開始

### 安裝

```bash
# Clone 專案
git clone https://github.com/Stone-811/swcardshow.git
cd swcardshow

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

打開 http://localhost:3000 查看網站。

### 部署

```bash
# 建置
npm run build

# 部署到 Firebase
npx firebase-tools deploy --only hosting
```

## 技術架構

| 類別 | 技術 |
|------|------|
| 前端框架 | Next.js 14 (App Router) |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS |
| 國際化 | next-intl |
| 資料庫 | Firebase Firestore |
| 託管 | Firebase Hosting |
| 爬蟲 | Python (requests, BeautifulSoup) |

## 專案結構

```
├── app/                    # Next.js App Router
│   └── [locale]/           # 多語言路由
├── components/             # React 元件
├── messages/               # 翻譯檔案
├── scraper/                # eBay 爬蟲工具
│   ├── ebay_scraper.py
│   └── README.md
├── public/                 # 靜態資源
└── lib/                    # 工具函數
```

## eBay 爬蟲

內建 eBay 球卡價格爬蟲，可爬取：
- 已售出商品（成交價格）
- 目前上架商品

詳見 [scraper/README.md](scraper/README.md)

```bash
cd scraper
pip install -r requirements.txt
python ebay_scraper.py
```

## 環境變數

複製 `.env.local.example` 為 `.env.local` 並填入 Firebase 憑證：

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
# ... 其他設定
```

## 網站頁面

| 頁面 | 路徑 | 說明 |
|------|------|------|
| 首頁 | `/zh-TW` | 服務介紹、精選文章 |
| 關於 | `/zh-TW/about` | 公司介紹 |
| 文章 | `/zh-TW/articles` | 球卡知識文章 |
| 商品 | `/zh-TW/products` | 商品展示（連結至 Yahoo 拍賣）|
| 聯絡 | `/zh-TW/contact` | 聯絡表單 |

## 授權

MIT License

## 聯絡

- Email: tingo8320@gmail.com
- Yahoo 拍賣: [SW ProCard 商店](https://tw.bid.yahoo.com/)
