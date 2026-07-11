"""
130point.com Scraper
爬取 eBay 球卡成交價格資料 (透過 130point.com)
使用 undetected-chromedriver 繞過 Cloudflare 防護
"""

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random
import csv
import json
import re
from datetime import datetime
from typing import List, Dict, Optional


# ============ 資料增強功能 ============

# 常見 NBA 球員名單 (可擴充)
NBA_PLAYERS = [
    'LeBron James', 'Michael Jordan', 'Kobe Bryant', 'Stephen Curry', 'Kevin Durant',
    'Luka Doncic', 'Giannis Antetokounmpo', 'Nikola Jokic', 'Joel Embiid', 'Jayson Tatum',
    'Trae Young', 'Ja Morant', 'Anthony Edwards', 'Victor Wembanyama', 'Zion Williamson',
    'Damian Lillard', 'Devin Booker', 'Kawhi Leonard', 'Paul George', 'Jimmy Butler',
    'Kyrie Irving', 'James Harden', 'Russell Westbrook', 'Chris Paul', 'Dwyane Wade',
    'Tim Duncan', 'Dirk Nowitzki', 'Steve Nash', 'Allen Iverson', 'Shaquille O\'Neal',
    'Magic Johnson', 'Larry Bird', 'Kareem Abdul-Jabbar', 'Wilt Chamberlain', 'Bill Russell',
    'Scottie Pippen', 'Dennis Rodman', 'Isiah Thomas', 'Karl Malone', 'John Stockton',
    'Patrick Ewing', 'Hakeem Olajuwon', 'David Robinson', 'Charles Barkley', 'Reggie Miller',
    'Vince Carter', 'Tracy McGrady', 'Ray Allen', 'Gary Payton', 'Jason Kidd',
    'Derrick Rose', 'Carmelo Anthony', 'Dwight Howard', 'Kevin Garnett', 'Paul Pierce',
    'Draymond Green', 'Klay Thompson', 'Anthony Davis', 'DeMar DeRozan', 'Pascal Siakam',
    'Tyrese Maxey', 'Tyrese Haliburton', 'De\'Aaron Fox', 'LaMelo Ball', 'Cade Cunningham',
    'Paolo Banchero', 'Scottie Barnes', 'Evan Mobley', 'Jalen Green', 'Franz Wagner',
    'Austin Reaves', 'Jeremy Lin', 'Yao Ming', 'Derek Fisher', 'Robert Horry',
    'Alonzo Mourning', 'Anfernee Hardaway', 'Grant Hill', 'Penny Hardaway', 'Chris Webber',
    'Manu Ginobili', 'Tony Parker', 'LaMarcus Aldridge', 'Aaron Gordon', 'Khris Middleton'
]

# 常見卡片品牌/系列
CARD_SETS = [
    'Panini One and One', 'Panini Prizm', 'Panini Select', 'Panini Mosaic', 'Panini Optic',
    'Panini Contenders', 'Panini National Treasures', 'Panini Immaculate', 'Panini Flawless',
    'Panini Crown Royale', 'Panini Court Kings', 'Panini Hoops', 'Panini Donruss',
    'Topps Chrome', 'Topps Finest', 'Topps Stadium Club', 'Topps Bowman',
    'Upper Deck', 'Upper Deck SP', 'Upper Deck SPx', 'Fleer', 'Fleer Ultra',
    'Skybox', 'Skybox Premium', 'NBA Hoops'
]


def extract_card_info(title: str) -> Dict:
    """
    從標題提取卡片詳細資訊

    Returns:
        包含以下欄位的字典:
        - player: 球員名稱
        - year: 年份
        - set_name: 卡片系列
        - numbering: 限量編號 (如 /99, /25, 1/1)
        - parallel: 平行版本 (如 Gold, Red, Blue)
        - grading: 評級 (如 PSA 10, BGS 9.5)
        - grading_company: 評級公司
        - is_auto: 是否簽名卡
        - is_rookie: 是否新人卡
        - card_number: 卡片編號
    """
    info = {}
    title_upper = title.upper()

    # 1. 提取球員名稱
    for player in NBA_PLAYERS:
        if player.upper() in title_upper or player.replace(' ', '').upper() in title_upper.replace(' ', ''):
            info['player'] = player
            break

    # 2. 提取年份 (格式: 2024-25, 2023-24, 2024, 2023)
    year_match = re.search(r'(20\d{2})[-/]?(20)?(\d{2})?', title)
    if year_match:
        year = year_match.group(1)
        if year_match.group(3):
            info['year'] = f"{year}-{year_match.group(3)}"
        else:
            info['year'] = year

    # 3. 提取卡片系列
    for card_set in CARD_SETS:
        if card_set.upper() in title_upper:
            info['set_name'] = card_set
            break

    # 4. 提取限量編號 (/99, /25, 1/1, #46/49)
    numbering_patterns = [
        r'(\d+)\s*/\s*(\d+)',      # 46/49, 1/1
        r'/\s*(\d+)',              # /99, /25
        r'#(\d+)/(\d+)',           # #46/49
    ]
    for pattern in numbering_patterns:
        match = re.search(pattern, title)
        if match:
            if len(match.groups()) == 2:
                info['numbering'] = f"{match.group(1)}/{match.group(2)}"
                info['print_run'] = int(match.group(2))
            else:
                info['numbering'] = f"/{match.group(1)}"
                info['print_run'] = int(match.group(1))
            break

    # 5. 提取平行版本
    parallels = ['Gold', 'Silver', 'Red', 'Blue', 'Green', 'Purple', 'Orange', 'Black',
                 'Pink', 'Holo', 'Prizm', 'Refractor', 'Sapphire', 'Ruby', 'Emerald',
                 'Shimmer', 'Cracked Ice', 'Tie-Dye', 'Tiger', 'Zebra', 'Camo',
                 'Wave', 'Disco', 'Mojo', 'Snakeskin', 'Choice', 'Fast Break']
    for parallel in parallels:
        if parallel.upper() in title_upper:
            info['parallel'] = parallel
            break

    # 6. 提取評級
    grading_match = re.search(r'(PSA|BGS|SGC|CGC|CSG|HGA)\s*(\d+\.?\d*)', title_upper)
    if grading_match:
        info['grading_company'] = grading_match.group(1)
        info['grading'] = f"{grading_match.group(1)} {grading_match.group(2)}"
        info['grade'] = float(grading_match.group(2))

    # 7. 檢查是否簽名卡
    auto_keywords = ['AUTO', 'AUTOGRAPH', 'SIGNED', 'SIGNATURE', 'ON CARD AUTO']
    info['is_auto'] = any(kw in title_upper for kw in auto_keywords)

    # 8. 檢查是否新人卡
    rookie_keywords = ['RC', 'ROOKIE', 'ROOKIES', '1ST YEAR']
    info['is_rookie'] = any(kw in title_upper for kw in rookie_keywords)

    # 9. 提取卡片編號 (#TMA-LKD, #123)
    card_num_match = re.search(r'#([A-Z0-9-]+)', title)
    if card_num_match:
        info['card_number'] = card_num_match.group(1)

    return info


def enhance_items(items: List[Dict]) -> List[Dict]:
    """為所有商品資料添加增強欄位"""
    for item in items:
        title = item.get('title', '')
        if title:
            card_info = extract_card_info(title)
            item.update(card_info)
    return items


def random_delay(min_sec: float = 1.0, max_sec: float = 3.0):
    """隨機延遲"""
    time.sleep(random.uniform(min_sec, max_sec))


def create_driver(headless: bool = False) -> uc.Chrome:
    """
    建立 undetected Chrome 瀏覽器

    注意: headless 模式通常會被 Cloudflare 擋住
    """
    options = uc.ChromeOptions()
    options.add_argument('--window-size=1920,1080')

    if headless:
        options.add_argument('--headless=new')

    driver = uc.Chrome(options=options, version_main=None)
    return driver


def scrape_130point(
    keywords: str,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sold_only: bool = True,
    max_results: int = 100,
    headless: bool = False
) -> List[Dict]:
    """
    爬取 130point.com 的成交資料

    Args:
        keywords: 搜尋關鍵字
        min_price: 最低價格
        max_price: 最高價格
        sold_only: 只顯示已售出商品
        max_results: 最大結果數
        headless: 無頭模式 (可能被擋)

    Returns:
        商品資料列表
    """
    driver = None
    items = []

    try:
        print("啟動瀏覽器...")
        driver = create_driver(headless)

        # 訪問首頁
        print("訪問 130point.com...")
        driver.get('https://130point.com/')

        # 等待 Cloudflare 驗證完成
        max_wait = 30
        waited = 0
        while waited < max_wait:
            time.sleep(3)
            waited += 3
            title = driver.title
            print(f"  等待中... ({waited}s) 標題: {title}")

            if title == '130 Point':
                print("  Cloudflare 驗證通過!")
                break
            elif '請稍候' in title or 'Cloudflare' in driver.page_source:
                continue
            else:
                break

        print(f"頁面標題: {driver.title}")

        # 找到搜尋框
        search_box = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'input[type="search"]'))
        )

        # 輸入搜尋關鍵字
        print(f"搜尋: {keywords}")
        search_box.click()
        time.sleep(0.5)
        search_box.clear()
        for char in keywords:
            search_box.send_keys(char)
            time.sleep(0.03)  # 模擬打字
        random_delay(1.0, 2.0)
        search_box.send_keys(Keys.RETURN)

        # 等待搜尋結果載入
        print("等待搜尋結果...")
        time.sleep(8)
        print(f"URL: {driver.current_url}")

        # 滾動頁面以載入更多結果
        driver.execute_script("window.scrollTo(0, 500);")
        time.sleep(2)

        # 如果只要已售出，點擊 Sold 標籤
        if sold_only:
            try:
                # 向下滾動避免被 header 遮住
                driver.execute_script("window.scrollTo(0, 200);")
                time.sleep(1)

                # 使用 ID 找 sold-tab 按鈕
                sold_tab = driver.find_element(By.ID, 'sold-tab')
                if sold_tab:
                    print(f"切換到 Sold 標籤...")
                    # 使用 JavaScript 點擊避免被其他元素遮住
                    driver.execute_script("arguments[0].click();", sold_tab)
                    time.sleep(5)
            except Exception as e:
                # 備用方案：用 XPath
                try:
                    sold_tabs = driver.find_elements(By.XPATH, '//button[contains(@id, "sold")]')
                    if sold_tabs:
                        driver.execute_script("arguments[0].click();", sold_tabs[0])
                        time.sleep(5)
                except:
                    print(f"無法切換到 Sold 標籤: {e}")

        # 滾動載入更多
        for i in range(3):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)

        # 解析結果
        print("解析搜尋結果...")

        if sold_only:
            # 直接從 sold-results-panel 解析
            items = parse_sold_panel(driver, max_results)
        else:
            items = parse_results(driver, max_results)

        print(f"找到 {len(items)} 筆資料")

    except Exception as e:
        print(f"爬取錯誤: {e}")
        import traceback
        traceback.print_exc()

    finally:
        if driver:
            driver.quit()
            print("瀏覽器已關閉")

    return items


def parse_sold_panel(driver, max_results: int = 100) -> List[Dict]:
    """解析 sold-results-panel 中的已售出商品"""
    items = []

    try:
        sold_panel = driver.find_element(By.ID, 'sold-results-panel')
        panel_text = sold_panel.text

        print(f"Sold panel 文字長度: {len(panel_text)}")

        # 逐行解析
        lines = panel_text.split('\n')
        current_item = {}
        i = 0

        while i < len(lines) and len(items) < max_results:
            line = lines[i].strip()
            i += 1

            if not line:
                continue

            # 跳過分頁控制
            if line in ['Per page', '32', '64', '96'] or line.isdigit():
                continue

            # 檢查是否為商品標題 (包含球卡關鍵字)
            is_title = (
                len(line) > 20 and
                any(kw in line for kw in ['Panini', 'Topps', 'PSA', 'BGS', 'SGC',
                                           'Auto', 'RC', '#', 'Prizm', 'Select',
                                           'Mosaic', 'Optic', 'Chrome', 'One and One',
                                           'One And One', 'Timeless'])
            )

            if is_title:
                current_item = {'title': line, 'status': 'sold'}

                # 接下來幾行是價格、類型、日期
                for j in range(min(6, len(lines) - i)):
                    next_line = lines[i + j].strip() if i + j < len(lines) else ''

                    # 價格 (USD)
                    if next_line.startswith('$') and 'USD' in next_line:
                        price_str = next_line.replace('$', '').replace('USD', '').replace(',', '').strip()
                        try:
                            current_item['price'] = float(price_str)
                            current_item['currency'] = 'USD'
                        except:
                            pass

                    # 拍賣類型
                    elif next_line in ['Auction', 'Fixed Price', 'Best Offer Accepted']:
                        current_item['listing_type'] = next_line

                    # 出價數和日期 (例: "10 bids · 11 Jul 26 11:32:51")
                    elif 'bids' in next_line or 'bid' in next_line or 'Jul' in next_line or 'Jun' in next_line:
                        current_item['sold_info'] = next_line

                        # 解析日期
                        if '·' in next_line:
                            date_part = next_line.split('·')[-1].strip()
                            current_item['sold_date'] = date_part

                # 儲存商品
                if current_item.get('title') and current_item.get('price'):
                    current_item['source'] = '130point'
                    current_item['scraped_at'] = datetime.now().isoformat()
                    items.append(current_item.copy())

    except Exception as e:
        print(f"解析 sold panel 錯誤: {e}")
        import traceback
        traceback.print_exc()

    return items


def parse_results(driver, max_results: int = 100) -> List[Dict]:
    """解析頁面上的商品結果"""
    items = []

    try:
        # 取得頁面內容
        body = driver.find_element(By.TAG_NAME, 'body')
        page_text = body.text

        print(f"頁面文字長度: {len(page_text)}")

        # 改用文字解析 - 逐行分析
        lines = page_text.split('\n')
        current_item = {}
        i = 0

        while i < len(lines):
            line = lines[i].strip()
            i += 1

            if not line:
                continue

            # 檢查是否為商品標題行 (長度較長且包含球卡關鍵字)
            is_title = (
                len(line) > 25 and
                any(kw in line for kw in ['Panini', 'Topps', 'PSA', 'BGS', 'SGC',
                                           'Auto', 'RC', '#', 'Prizm', 'Select',
                                           'Mosaic', 'Optic', 'Chrome', 'Bowman',
                                           'Upper Deck', 'Fleer', 'Donruss'])
            )

            if is_title:
                # 這是一個新商品標題
                current_item = {'title': line}

                # 接下來幾行應該是價格和狀態
                for j in range(min(5, len(lines) - i)):
                    next_line = lines[i + j].strip() if i + j < len(lines) else ''

                    # 價格
                    if next_line.startswith('$') and 'USD' in next_line:
                        price_str = next_line.replace('$', '').replace('USD', '').replace(',', '').strip()
                        try:
                            current_item['price'] = float(price_str)
                            current_item['currency'] = 'USD'
                        except:
                            pass

                    # 狀態
                    elif 'Sold' in next_line and ('·' in next_line or 'ago' in next_line.lower()):
                        current_item['status'] = 'sold'
                        current_item['sold_info'] = next_line
                    elif 'Auction' in next_line:
                        current_item['status'] = 'live'
                        current_item['listing_type'] = 'auction'
                    elif 'Fixed Price' in next_line:
                        current_item['status'] = 'live'
                        current_item['listing_type'] = 'fixed'

                # 儲存商品
                if current_item.get('title') and current_item.get('price'):
                    current_item['source'] = '130point'
                    current_item['scraped_at'] = datetime.now().isoformat()
                    items.append(current_item.copy())

                    if len(items) >= max_results:
                        break

    except Exception as e:
        print(f"解析錯誤: {e}")
        import traceback
        traceback.print_exc()

    return items


def save_results(items: List[Dict], prefix: str = '130point'):
    """儲存結果"""
    if not items:
        print("沒有資料可儲存")
        return

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

    # 收集所有可能的欄位
    all_fields = set()
    for item in items:
        all_fields.update(item.keys())

    # 定義欄位順序
    field_order = [
        'title', 'price', 'currency', 'status', 'listing_type', 'sold_date', 'sold_info',
        'player', 'year', 'set_name', 'numbering', 'print_run', 'parallel',
        'grading', 'grading_company', 'grade', 'is_auto', 'is_rookie', 'card_number',
        'source', 'scraped_at'
    ]
    # 按順序排列，未知欄位放最後
    fieldnames = [f for f in field_order if f in all_fields]
    fieldnames += [f for f in all_fields if f not in field_order]

    # CSV
    csv_file = f'{prefix}_{timestamp}.csv'
    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(items)
    print(f"已儲存到 {csv_file}")

    # JSON
    json_file = f'{prefix}_{timestamp}.json'
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    print(f"已儲存到 {json_file}")


def print_enhanced_stats(items: List[Dict]):
    """列印增強欄位統計"""
    if not items:
        return

    print("\n" + "=" * 60)
    print("資料增強統計:")

    # 球員識別率
    players_found = sum(1 for i in items if i.get('player'))
    print(f"  球員識別: {players_found}/{len(items)} ({players_found/len(items)*100:.0f}%)")

    # 限量編號識別率
    numbering_found = sum(1 for i in items if i.get('numbering'))
    print(f"  限量編號: {numbering_found}/{len(items)} ({numbering_found/len(items)*100:.0f}%)")

    # 評級識別率
    grading_found = sum(1 for i in items if i.get('grading'))
    print(f"  評級資訊: {grading_found}/{len(items)} ({grading_found/len(items)*100:.0f}%)")

    # 簽名卡數量
    auto_count = sum(1 for i in items if i.get('is_auto'))
    print(f"  簽名卡: {auto_count}/{len(items)} ({auto_count/len(items)*100:.0f}%)")

    # 球員排行 (按成交數量)
    player_counts = {}
    player_prices = {}
    for item in items:
        player = item.get('player')
        if player:
            player_counts[player] = player_counts.get(player, 0) + 1
            if player not in player_prices:
                player_prices[player] = []
            player_prices[player].append(item.get('price', 0))

    if player_counts:
        print("\n  球員成交排行:")
        sorted_players = sorted(player_counts.items(), key=lambda x: -x[1])[:5]
        for player, count in sorted_players:
            avg_price = sum(player_prices[player]) / len(player_prices[player])
            print(f"    {player}: {count} 筆, 均價 ${avg_price:,.0f}")

    # 限量編號分布
    print_run_ranges = {'1/1': 0, '≤10': 0, '11-25': 0, '26-50': 0, '51-99': 0, '≥100': 0}
    for item in items:
        pr = item.get('print_run')
        if pr:
            if pr == 1:
                print_run_ranges['1/1'] += 1
            elif pr <= 10:
                print_run_ranges['≤10'] += 1
            elif pr <= 25:
                print_run_ranges['11-25'] += 1
            elif pr <= 50:
                print_run_ranges['26-50'] += 1
            elif pr <= 99:
                print_run_ranges['51-99'] += 1
            else:
                print_run_ranges['≥100'] += 1

    if any(print_run_ranges.values()):
        print("\n  限量編號分布:")
        for range_name, count in print_run_ranges.items():
            if count > 0:
                print(f"    {range_name}: {count} 筆")

    print("=" * 60)


def print_stats(items: List[Dict]):
    """列印統計資料"""
    if not items:
        return

    prices = [item['price'] for item in items if item.get('price', 0) > 0]
    sold_count = len([i for i in items if i.get('status') == 'sold'])

    if prices:
        print("\n" + "=" * 60)
        print("價格統計:")
        print(f"  總筆數: {len(items)}")
        print(f"  已售出: {sold_count}")
        print(f"  最低價: ${min(prices):,.2f}")
        print(f"  最高價: ${max(prices):,.2f}")
        print(f"  平均價: ${sum(prices)/len(prices):,.2f}")
        if len(prices) > 0:
            sorted_prices = sorted(prices)
            median = sorted_prices[len(prices)//2]
            print(f"  中位數: ${median:,.2f}")
        print("=" * 60)


def save_to_firebase(items: List[Dict], credentials_path: str):
    """儲存資料到 Firebase Firestore"""
    try:
        from firebase_storage import FirebaseStorage
        storage = FirebaseStorage(credentials_path)
        storage.save_cards_batch(items)
        print(f"已儲存 {len(items)} 筆資料到 Firebase")
    except ImportError:
        print("請安裝 firebase-admin: pip install firebase-admin")
    except Exception as e:
        print(f"Firebase 儲存失敗: {e}")


def main():
    """主程式"""
    # ============ 設定 ============
    KEYWORDS = "panini one and one timeless moments auto"
    MIN_PRICE = 50
    MAX_PRICE = None
    SOLD_ONLY = True
    MAX_RESULTS = 50
    HEADLESS = False  # 建議使用 False，headless 容易被擋
    SAVE_TO_FIREBASE = False  # 是否存入 Firebase
    FIREBASE_CREDENTIALS = 'serviceAccount.json'  # Firebase 憑證

    print("\n" + "=" * 60)
    print("130point.com 爬蟲")
    print("=" * 60)
    print(f"關鍵字: {KEYWORDS}")
    print(f"價格範圍: ${MIN_PRICE or 0} - ${MAX_PRICE or '∞'}")
    print(f"只顯示已售出: {SOLD_ONLY}")
    print("-" * 60)

    items = scrape_130point(
        keywords=KEYWORDS,
        min_price=MIN_PRICE,
        max_price=MAX_PRICE,
        sold_only=SOLD_ONLY,
        max_results=MAX_RESULTS,
        headless=HEADLESS
    )

    if items:
        # 資料增強 - 提取球員、編號、評級等資訊
        print("\n正在增強資料...")
        items = enhance_items(items)

        # 顯示前 10 筆 (含增強欄位)
        print("\n前 10 筆結果:")
        print("-" * 70)
        for i, item in enumerate(items[:10], 1):
            title = item.get('title', '')[:55]
            price = item.get('price', 0)
            player = item.get('player', '-')
            numbering = item.get('numbering', '-')
            grading = item.get('grading', '-')
            is_auto = '✓' if item.get('is_auto') else '-'

            print(f"[{i}] {title}...")
            print(f"    💰 ${price:,.2f} | 🏀 {player} | 📊 {numbering} | 🏆 {grading} | ✍️ Auto:{is_auto}")

        # 統計增強資料
        print_enhanced_stats(items)

        print_stats(items)
        save_results(items, 'one_and_one_sold')

        # 儲存到 Firebase
        if SAVE_TO_FIREBASE:
            save_to_firebase(items, FIREBASE_CREDENTIALS)
    else:
        print("\n沒有找到結果")


if __name__ == '__main__':
    main()
