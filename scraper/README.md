# eBay Sports Card Scraper

爬取 eBay 球卡交易資料的 Python 工具，支援 API 查詢和網頁爬蟲。

## 功能

| 功能 | 資料來源 | 說明 |
|------|----------|------|
| 上架商品 | eBay Browse API | 目前正在販售的商品 |
| 已售出商品 | 網頁爬蟲 | 歷史成交價格資料 |

## 安裝

```bash
cd scraper
pip install -r requirements.txt
```

## 設定

1. 複製設定檔範本：

```bash
cp config.example.py config.py
```

2. 編輯 `config.py`，填入你的 eBay API 憑證：

```python
EBAY_CONFIG = {
    'app_id': 'YOUR_APP_ID',
    'dev_id': 'YOUR_DEV_ID',
    'cert_id': 'YOUR_CERT_ID',
    'environment': 'production',
}
```

> 取得 API 憑證：https://developer.ebay.com/my/keys

## 使用方法

### 基本使用

```bash
python ebay_scraper.py
```

### 修改搜尋條件

編輯 `ebay_scraper.py` 的 `main()` 函數：

```python
KEYWORDS = "PSA 10 Michael Jordan"  # 搜尋關鍵字
MIN_PRICE = 50                       # 最低價格 (USD)
MAX_PRICE = 5000                     # 最高價格 (USD)
MAX_PAGES = 3                        # 已售出商品最大頁數
API_LIMIT = 50                       # 上架商品最大筆數
```

### 程式碼範例

```python
from ebay_scraper import scrape_sold_items, scrape_listings, save_to_csv

# 爬取已售出商品
sold = scrape_sold_items(
    keywords="PSA 10 大谷翔平",
    min_price=100,
    max_price=10000,
    max_pages=5
)

# 爬取目前上架商品
listings = scrape_listings(
    keywords="PSA 10 大谷翔平",
    min_price=100,
    max_price=10000,
    limit=100
)

# 儲存結果
save_to_csv(sold, "ohtani_sold.csv")
```

## 輸出格式

### 已售出商品 (CSV/JSON)

| 欄位 | 說明 |
|------|------|
| title | 商品標題 |
| price | 成交價格 |
| currency | 幣別 |
| sold_date | 成交日期 |
| url | 商品連結 |
| image_url | 圖片連結 |
| shipping | 運費 |
| seller | 賣家 |
| source | 資料來源 |

### 上架商品 (CSV/JSON)

| 欄位 | 說明 |
|------|------|
| item_id | 商品 ID |
| title | 商品標題 |
| price | 售價 |
| currency | 幣別 |
| condition | 商品狀態 |
| url | 商品連結 |
| image_url | 圖片連結 |
| seller | 賣家 |
| location | 賣家所在地 |
| source | 資料來源 |

## 反爬蟲機制

此工具內建以下反爬蟲機制：

- **User-Agent 輪換**：隨機使用不同瀏覽器的 User-Agent
- **隨機延遲**：每次請求間隔 2-5 秒
- **Session 管理**：模擬真實瀏覽器行為
- **Proxy 支援**：可設定代理伺服器

### 使用 Proxy

```python
from ebay_scraper import EbaySoldScraper

scraper = EbaySoldScraper(proxy="http://your-proxy:8080")
items = scraper.scrape("PSA 10 Jordan", max_pages=3)
```

## 注意事項

1. **請遵守 eBay 使用條款**
2. **控制爬取頻率**，避免對伺服器造成負擔
3. **API 有每日呼叫次數限制** (免費帳號約 5000 次/日)
4. **已售出資料可能不完整**，eBay 只保留約 90 天的成交記錄
5. **網頁爬蟲可能被封鎖** - eBay 有嚴格的反爬蟲機制

## 替代方案（已售出資料）

如果網頁爬蟲被封鎖，可使用以下服務：

| 服務 | 說明 | 連結 |
|------|------|------|
| Apify eBay Scraper | 雲端爬蟲服務 | https://apify.com/dtrungtin/ebay-scraper |
| Oxylabs | 企業級爬蟲 API | https://oxylabs.io/products/scraper-api/ecommerce/ebays |
| SportsCardsPro | 球卡價格資料庫 | https://www.sportscardspro.com/api-documentation |

這些服務提供穩定的資料存取，但可能需要付費。

## 檔案結構

```
scraper/
├── ebay_scraper.py    # 主程式
├── config.py          # API 憑證 (不要 commit!)
├── config.example.py  # 設定檔範本
├── requirements.txt   # 依賴套件
├── README.md          # 說明文件
└── *.csv / *.json     # 輸出檔案 (不要 commit!)
```

## License

MIT
