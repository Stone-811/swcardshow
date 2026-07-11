"""
eBay Selenium Scraper
使用真實瀏覽器爬取已售出商品（繞過反爬蟲機制）
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import csv
import json
import time
import random
from datetime import datetime
from typing import List, Dict, Optional


def create_driver(headless: bool = True) -> webdriver.Chrome:
    """建立 Chrome WebDriver"""
    options = Options()

    if headless:
        options.add_argument('--headless=new')

    # 反偵測設定
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    # 排除自動化標誌
    options.add_experimental_option('excludeSwitches', ['enable-automation'])
    options.add_experimental_option('useAutomationExtension', False)

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    # 修改 navigator.webdriver
    driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
        'source': '''
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            })
        '''
    })

    return driver


def scrape_sold_items_selenium(
    keywords: str,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    max_pages: int = 3,
    headless: bool = True
) -> List[Dict]:
    """
    使用 Selenium 爬取已售出商品

    Args:
        keywords: 搜尋關鍵字
        min_price: 最低價格
        max_price: 最高價格
        max_pages: 最大頁數
        headless: 是否使用無頭模式

    Returns:
        商品資料列表
    """
    driver = None
    all_items = []

    try:
        print("啟動瀏覽器...")
        driver = create_driver(headless)

        # 建立搜尋 URL
        base_url = 'https://www.ebay.com/sch/i.html'
        params = f'?_nkw={keywords.replace(" ", "+")}&_sacat=212&LH_Sold=1&LH_Complete=1&_sop=13'

        if min_price:
            params += f'&_udlo={min_price}'
        if max_price:
            params += f'&_udhi={max_price}'

        for page in range(1, max_pages + 1):
            url = base_url + params
            if page > 1:
                url += f'&_pgn={page}'

            print(f"正在爬取第 {page}/{max_pages} 頁...")
            driver.get(url)

            # 等待頁面載入
            time.sleep(random.uniform(2, 4))

            try:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, '.s-item'))
                )
            except:
                print(f"  第 {page} 頁載入超時")
                break

            # 解析商品
            items = driver.find_elements(By.CSS_SELECTOR, '.s-item')
            page_items = []

            for item in items:
                try:
                    # 標題
                    title_elem = item.find_elements(By.CSS_SELECTOR, '.s-item__title')
                    title = title_elem[0].text if title_elem else ''
                    if not title or title == 'Shop on eBay':
                        continue

                    # 價格
                    price_elem = item.find_elements(By.CSS_SELECTOR, '.s-item__price')
                    price_text = price_elem[0].text if price_elem else '0'
                    if 'to' in price_text.lower():
                        price_text = price_text.split('to')[0]
                    price = float(''.join(c for c in price_text if c.isdigit() or c == '.') or '0')

                    # URL
                    link_elem = item.find_elements(By.CSS_SELECTOR, '.s-item__link')
                    url = link_elem[0].get_attribute('href') if link_elem else ''

                    # 成交日期
                    sold_elem = item.find_elements(By.CSS_SELECTOR, '.s-item__title--tagblock .POSITIVE')
                    sold_date = sold_elem[0].text if sold_elem else ''

                    page_items.append({
                        'title': title,
                        'price': price,
                        'currency': 'USD',
                        'sold_date': sold_date,
                        'url': url,
                        'source': 'selenium_sold',
                    })

                except Exception as e:
                    continue

            all_items.extend(page_items)
            print(f"  已取得 {len(page_items)} 筆，總計 {len(all_items)} 筆")

            if len(page_items) == 0:
                break

            # 隨機延遲
            if page < max_pages:
                time.sleep(random.uniform(3, 6))

    except Exception as e:
        print(f"爬取錯誤: {e}")

    finally:
        if driver:
            driver.quit()
            print("瀏覽器已關閉")

    return all_items


def save_results(items: List[Dict], prefix: str = 'sold'):
    """儲存結果"""
    if not items:
        print("沒有資料可儲存")
        return

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

    # CSV
    csv_file = f'{prefix}_{timestamp}.csv'
    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=items[0].keys())
        writer.writeheader()
        writer.writerows(items)
    print(f"已儲存到 {csv_file}")

    # JSON
    json_file = f'{prefix}_{timestamp}.json'
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    print(f"已儲存到 {json_file}")


def print_stats(items: List[Dict]):
    """列印統計"""
    prices = [item['price'] for item in items if item.get('price', 0) > 0]
    if prices:
        print("\n" + "=" * 60)
        print("成交價格統計:")
        print(f"  筆數: {len(prices)}")
        print(f"  最低價: ${min(prices):,.2f}")
        print(f"  最高價: ${max(prices):,.2f}")
        print(f"  平均價: ${sum(prices)/len(prices):,.2f}")
        print(f"  中位數: ${sorted(prices)[len(prices)//2]:,.2f}")
        print("=" * 60)


def main():
    """主程式"""
    # ============ 設定 ============
    KEYWORDS = "panini one and one timeless moments auto"
    MIN_PRICE = 50
    MAX_PRICE = None
    MAX_PAGES = 3
    HEADLESS = True  # False = 顯示瀏覽器視窗

    print("\n" + "=" * 60)
    print("eBay Selenium 爬蟲 (已售出商品)")
    print("=" * 60)
    print(f"關鍵字: {KEYWORDS}")
    print(f"價格範圍: ${MIN_PRICE or 0} - ${MAX_PRICE or '∞'}")
    print("-" * 60)

    items = scrape_sold_items_selenium(
        keywords=KEYWORDS,
        min_price=MIN_PRICE,
        max_price=MAX_PRICE,
        max_pages=MAX_PAGES,
        headless=HEADLESS
    )

    if items:
        print(f"\n找到 {len(items)} 筆已成交商品")

        # 顯示前 10 筆
        print("\n前 10 筆成交記錄:")
        print("-" * 60)
        for i, item in enumerate(items[:10], 1):
            print(f"[{i}] {item['title'][:65]}...")
            print(f"    成交價: ${item['price']:.2f} | {item['sold_date']}")

        print_stats(items)
        save_results(items, 'one_and_one_sold')
    else:
        print("\n沒有找到結果")


if __name__ == '__main__':
    main()
