"""
eBay Sports Card Scraper
支援 API 查詢和網頁爬蟲（已售出商品）
"""

import requests
import csv
import json
import base64
import random
import time
from datetime import datetime
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
from urllib.parse import quote_plus

from config import EBAY_CONFIG


# ============================================================
# Anti-Scraping Configuration
# ============================================================

USER_AGENTS = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
]


# ============================================================
# Utility Functions
# ============================================================

def get_random_user_agent() -> str:
    """隨機取得 User-Agent"""
    return random.choice(USER_AGENTS)


def random_delay(min_sec: float = 1.0, max_sec: float = 3.0) -> None:
    """隨機延遲，避免被偵測為機器人"""
    delay = random.uniform(min_sec, max_sec)
    time.sleep(delay)


def create_session(proxy: Optional[str] = None) -> requests.Session:
    """建立帶有反爬蟲設定的 Session"""
    session = requests.Session()
    session.headers.update({
        'User-Agent': get_random_user_agent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
    })
    if proxy:
        session.proxies = {'http': proxy, 'https': proxy}
    return session


def parse_price(price_str: str) -> float:
    """解析價格字串為數字"""
    if not price_str:
        return 0.0
    # Remove currency symbols and commas
    cleaned = ''.join(c for c in price_str if c.isdigit() or c == '.')
    try:
        return float(cleaned) if cleaned else 0.0
    except ValueError:
        return 0.0


def save_to_csv(items: List[Dict], filename: str) -> None:
    """儲存資料為 CSV 檔案"""
    if not items:
        print("沒有資料可儲存")
        return

    fieldnames = list(items[0].keys())
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for item in items:
            row = {k: str(v) if isinstance(v, list) else v for k, v in item.items()}
            writer.writerow(row)
    print(f"已儲存 {len(items)} 筆資料到 {filename}")


def save_to_json(items: List[Dict], filename: str) -> None:
    """儲存資料為 JSON 檔案"""
    if not items:
        print("沒有資料可儲存")
        return

    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    print(f"已儲存 {len(items)} 筆資料到 {filename}")


def print_statistics(items: List[Dict]) -> None:
    """列印價格統計資訊"""
    prices = [item['price'] for item in items if item.get('price', 0) > 0]
    if prices:
        print("\n" + "=" * 60)
        print("價格統計:")
        print(f"  筆數: {len(prices)}")
        print(f"  最低價: ${min(prices):,.2f}")
        print(f"  最高價: ${max(prices):,.2f}")
        print(f"  平均價: ${sum(prices)/len(prices):,.2f}")
        print(f"  中位數: ${sorted(prices)[len(prices)//2]:,.2f}")
        print("=" * 60)


# ============================================================
# eBay Browse API (目前上架商品)
# ============================================================

class EbayBrowseAPI:
    """使用 eBay Browse API 搜尋目前上架的商品"""

    def __init__(self):
        self.app_id = EBAY_CONFIG['app_id']
        self.cert_id = EBAY_CONFIG['cert_id']
        self.access_token = None
        self.token_url = 'https://api.ebay.com/identity/v1/oauth2/token'
        self.browse_url = 'https://api.ebay.com/buy/browse/v1/item_summary/search'

    def get_access_token(self) -> Optional[str]:
        """取得 OAuth2 Access Token"""
        credentials = f"{self.app_id}:{self.cert_id}"
        encoded = base64.b64encode(credentials.encode()).decode()

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': f'Basic {encoded}'
        }
        data = {
            'grant_type': 'client_credentials',
            'scope': 'https://api.ebay.com/oauth/api_scope'
        }

        try:
            response = requests.post(self.token_url, headers=headers, data=data)
            response.raise_for_status()
            self.access_token = response.json().get('access_token')
            print("API Token 取得成功")
            return self.access_token
        except requests.exceptions.RequestException as e:
            print(f"取得 Token 失敗: {e}")
            return None

    def search(
        self,
        keywords: str,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        limit: int = 200
    ) -> List[Dict]:
        """搜尋目前上架的商品"""
        if not self.access_token and not self.get_access_token():
            return []

        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        }

        all_items = []
        offset = 0
        page_limit = min(50, limit)

        while len(all_items) < limit:
            params = {
                'q': keywords,
                'category_ids': '212',  # Sports Trading Cards
                'limit': page_limit,
                'offset': offset,
            }

            if min_price or max_price:
                price_filter = f"price:[{min_price or ''}..{max_price or ''}]"
                params['filter'] = price_filter

            try:
                response = requests.get(self.browse_url, headers=headers, params=params)
                response.raise_for_status()
                data = response.json()

                for item in data.get('itemSummaries', []):
                    all_items.append({
                        'item_id': item.get('itemId', ''),
                        'title': item.get('title', ''),
                        'price': float(item.get('price', {}).get('value', 0)),
                        'currency': item.get('price', {}).get('currency', 'USD'),
                        'condition': item.get('condition', ''),
                        'url': item.get('itemWebUrl', ''),
                        'image_url': item.get('image', {}).get('imageUrl', ''),
                        'seller': item.get('seller', {}).get('username', ''),
                        'location': item.get('itemLocation', {}).get('country', ''),
                        'source': 'api_listing',
                    })

                if len(data.get('itemSummaries', [])) < page_limit:
                    break
                offset += page_limit
                random_delay(0.5, 1.0)

            except requests.exceptions.RequestException as e:
                print(f"API 錯誤: {e}")
                break

        return all_items[:limit]


# ============================================================
# eBay Web Scraper (已售出商品)
# ============================================================

class EbaySoldScraper:
    """網頁爬蟲 - 爬取 eBay 已售出商品"""

    def __init__(self, proxy: Optional[str] = None):
        self.session = create_session(proxy)
        self.base_url = 'https://www.ebay.com/sch/i.html'

    def build_url(
        self,
        keywords: str,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        page: int = 1
    ) -> str:
        """建立搜尋 URL"""
        params = {
            '_nkw': keywords,
            '_sacat': '212',  # Sports Trading Cards
            'LH_Complete': '1',  # Completed listings
            'LH_Sold': '1',  # Sold items only
            '_sop': '13',  # Sort by end date: newest first
            '_ipg': '240',  # Items per page
        }

        if min_price:
            params['_udlo'] = str(min_price)
        if max_price:
            params['_udhi'] = str(max_price)
        if page > 1:
            params['_pgn'] = str(page)

        query_string = '&'.join(f'{k}={quote_plus(str(v))}' for k, v in params.items())
        return f"{self.base_url}?{query_string}"

    def parse_item(self, item_element) -> Optional[Dict]:
        """解析單一商品元素"""
        try:
            # Title
            title_elem = item_element.select_one('.s-item__title')
            title = title_elem.get_text(strip=True) if title_elem else ''
            if not title or title == 'Shop on eBay':
                return None

            # Price
            price_elem = item_element.select_one('.s-item__price')
            price_text = price_elem.get_text(strip=True) if price_elem else '0'
            # Handle price ranges like "$10.00 to $20.00"
            if 'to' in price_text.lower():
                price_text = price_text.split('to')[0]
            price = parse_price(price_text)

            # URL
            link_elem = item_element.select_one('.s-item__link')
            url = link_elem.get('href', '') if link_elem else ''

            # Image
            img_elem = item_element.select_one('.s-item__image-img')
            image_url = img_elem.get('src', '') if img_elem else ''

            # Sold date
            sold_elem = item_element.select_one('.s-item__title--tagblock .POSITIVE')
            sold_date = sold_elem.get_text(strip=True) if sold_elem else ''

            # Shipping
            shipping_elem = item_element.select_one('.s-item__shipping')
            shipping = shipping_elem.get_text(strip=True) if shipping_elem else ''

            # Seller
            seller_elem = item_element.select_one('.s-item__seller-info-text')
            seller = seller_elem.get_text(strip=True) if seller_elem else ''

            return {
                'title': title,
                'price': price,
                'currency': 'USD',
                'sold_date': sold_date,
                'url': url,
                'image_url': image_url,
                'shipping': shipping,
                'seller': seller,
                'source': 'web_sold',
            }

        except Exception as e:
            return None

    def scrape_page(self, url: str, retry: int = 3) -> List[Dict]:
        """爬取單一頁面"""
        for attempt in range(retry):
            # Rotate user agent and add referer
            self.session.headers['User-Agent'] = get_random_user_agent()
            self.session.headers['Referer'] = 'https://www.ebay.com/'

            try:
                # First visit homepage to get cookies
                if attempt == 0:
                    self.session.get('https://www.ebay.com/', timeout=10)
                    random_delay(1.0, 2.0)

                response = self.session.get(url, timeout=30)

                if response.status_code == 403:
                    print(f"  被封鎖 (403)，嘗試 {attempt + 1}/{retry}...")
                    random_delay(5.0, 10.0)
                    continue

                response.raise_for_status()

                soup = BeautifulSoup(response.text, 'html.parser')
                items = []

                for item_elem in soup.select('.s-item'):
                    parsed = self.parse_item(item_elem)
                    if parsed:
                        items.append(parsed)

                return items

            except requests.exceptions.RequestException as e:
                print(f"  爬取錯誤: {e}")
                if attempt < retry - 1:
                    random_delay(3.0, 5.0)

        print("  多次嘗試失敗，建議使用 Proxy 或稍後再試")
        return []

    def scrape(
        self,
        keywords: str,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        max_pages: int = 5,
        delay_range: tuple = (2.0, 5.0)
    ) -> List[Dict]:
        """爬取多頁已售出商品"""
        all_items = []

        for page in range(1, max_pages + 1):
            print(f"正在爬取第 {page}/{max_pages} 頁...")

            url = self.build_url(keywords, min_price, max_price, page)
            items = self.scrape_page(url)

            if not items:
                print(f"第 {page} 頁沒有更多結果")
                break

            all_items.extend(items)
            print(f"  已取得 {len(items)} 筆，總計 {len(all_items)} 筆")

            if page < max_pages:
                random_delay(*delay_range)

        return all_items


# ============================================================
# Main Functions
# ============================================================

def scrape_listings(
    keywords: str,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    limit: int = 100
) -> List[Dict]:
    """爬取目前上架的商品 (使用 API)"""
    print("\n" + "=" * 60)
    print("搜尋目前上架商品 (eBay Browse API)")
    print("=" * 60)
    print(f"關鍵字: {keywords}")
    print(f"價格範圍: ${min_price or 0} - ${max_price or '∞'}")

    api = EbayBrowseAPI()
    items = api.search(keywords, min_price, max_price, limit)
    print(f"\n找到 {len(items)} 筆上架商品")
    return items


def scrape_sold_items(
    keywords: str,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    max_pages: int = 5,
    proxy: Optional[str] = None
) -> List[Dict]:
    """爬取已售出商品 (使用網頁爬蟲)"""
    print("\n" + "=" * 60)
    print("搜尋已售出商品 (Web Scraper)")
    print("=" * 60)
    print(f"關鍵字: {keywords}")
    print(f"價格範圍: ${min_price or 0} - ${max_price or '∞'}")
    print(f"最多頁數: {max_pages}")

    scraper = EbaySoldScraper(proxy)
    items = scraper.scrape(keywords, min_price, max_price, max_pages)
    print(f"\n找到 {len(items)} 筆已售出商品")
    return items


def main():
    """主程式"""
    # ============ 設定搜尋條件 ============
    KEYWORDS = "PSA 10 Michael Jordan"
    MIN_PRICE = 50
    MAX_PRICE = 5000
    MAX_PAGES = 3  # 已售出商品的最大頁數
    API_LIMIT = 50  # 上架商品的最大筆數

    print("\n" + "=" * 60)
    print("eBay 球卡爬蟲")
    print("=" * 60)

    # 爬取已售出商品
    sold_items = scrape_sold_items(
        keywords=KEYWORDS,
        min_price=MIN_PRICE,
        max_price=MAX_PRICE,
        max_pages=MAX_PAGES
    )

    # 爬取目前上架商品
    listing_items = scrape_listings(
        keywords=KEYWORDS,
        min_price=MIN_PRICE,
        max_price=MAX_PRICE,
        limit=API_LIMIT
    )

    # 合併結果
    all_items = sold_items + listing_items

    if all_items:
        # 顯示前 5 筆已售出
        if sold_items:
            print("\n前 5 筆已售出商品:")
            print("-" * 60)
            for item in sold_items[:5]:
                print(f"標題: {item['title'][:60]}...")
                print(f"成交價: ${item['price']:.2f} | {item['sold_date']}")
                print("-" * 60)

        # 統計
        print_statistics(sold_items)

        # 儲存
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        if sold_items:
            save_to_csv(sold_items, f'sold_cards_{timestamp}.csv')
            save_to_json(sold_items, f'sold_cards_{timestamp}.json')
        if listing_items:
            save_to_csv(listing_items, f'listings_{timestamp}.csv')
    else:
        print("\n沒有找到任何結果")


if __name__ == '__main__':
    main()
