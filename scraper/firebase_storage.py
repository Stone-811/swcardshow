"""
Firebase Firestore Storage
將爬取的球卡資料存入 Firebase
"""

import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
from typing import List, Dict, Optional
import json
import os


class FirebaseStorage:
    """Firebase Firestore 資料庫管理"""

    def __init__(self, credentials_path: Optional[str] = None):
        """
        初始化 Firebase

        Args:
            credentials_path: Firebase 服務帳戶 JSON 檔案路徑
                            如果為 None，會嘗試使用環境變數
        """
        if not firebase_admin._apps:
            if credentials_path and os.path.exists(credentials_path):
                cred = credentials.Certificate(credentials_path)
                firebase_admin.initialize_app(cred)
            else:
                # 使用預設憑證（需要設定 GOOGLE_APPLICATION_CREDENTIALS 環境變數）
                firebase_admin.initialize_app()

        self.db = firestore.client()
        self.cards_collection = 'ebay_cards'
        self.stats_collection = 'card_stats'

    def save_card(self, card_data: Dict) -> str:
        """
        儲存單張卡片資料

        Args:
            card_data: 卡片資料字典

        Returns:
            文件 ID
        """
        # 加入時間戳記
        card_data['created_at'] = firestore.SERVER_TIMESTAMP
        card_data['updated_at'] = firestore.SERVER_TIMESTAMP

        # 使用 item_id 或 title hash 作為文件 ID
        doc_id = card_data.get('item_id') or str(hash(card_data.get('title', '')))

        doc_ref = self.db.collection(self.cards_collection).document(doc_id)
        doc_ref.set(card_data, merge=True)

        return doc_id

    def save_cards_batch(self, cards: List[Dict]) -> int:
        """
        批次儲存多張卡片資料

        Args:
            cards: 卡片資料列表

        Returns:
            成功儲存的數量
        """
        if not cards:
            return 0

        batch = self.db.batch()
        count = 0

        for card in cards:
            card['created_at'] = firestore.SERVER_TIMESTAMP
            card['updated_at'] = firestore.SERVER_TIMESTAMP

            doc_id = card.get('item_id') or str(hash(card.get('title', '')))
            doc_ref = self.db.collection(self.cards_collection).document(doc_id)
            batch.set(doc_ref, card, merge=True)
            count += 1

            # Firestore 批次寫入限制為 500
            if count % 500 == 0:
                batch.commit()
                batch = self.db.batch()

        # 提交剩餘的資料
        if count % 500 != 0:
            batch.commit()

        return count

    def get_cards(
        self,
        keyword: Optional[str] = None,
        source: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        limit: int = 100
    ) -> List[Dict]:
        """
        查詢卡片資料

        Args:
            keyword: 標題關鍵字
            source: 資料來源 (api_listing, web_sold)
            min_price: 最低價格
            max_price: 最高價格
            limit: 最大筆數

        Returns:
            卡片資料列表
        """
        query = self.db.collection(self.cards_collection)

        if source:
            query = query.where('source', '==', source)

        if min_price is not None:
            query = query.where('price', '>=', min_price)

        if max_price is not None:
            query = query.where('price', '<=', max_price)

        query = query.order_by('price', direction=firestore.Query.DESCENDING)
        query = query.limit(limit)

        docs = query.stream()
        cards = []

        for doc in docs:
            card = doc.to_dict()
            card['id'] = doc.id
            # 過濾關鍵字（Firestore 不支援全文搜尋）
            if keyword and keyword.lower() not in card.get('title', '').lower():
                continue
            cards.append(card)

        return cards

    def get_price_stats(self, keyword: str) -> Dict:
        """
        取得價格統計資料

        Args:
            keyword: 搜尋關鍵字

        Returns:
            統計資料字典
        """
        cards = self.get_cards(keyword=keyword, limit=1000)

        if not cards:
            return {'count': 0}

        prices = [c['price'] for c in cards if c.get('price', 0) > 0]

        if not prices:
            return {'count': len(cards), 'with_price': 0}

        sorted_prices = sorted(prices)
        return {
            'keyword': keyword,
            'count': len(cards),
            'with_price': len(prices),
            'min_price': min(prices),
            'max_price': max(prices),
            'avg_price': sum(prices) / len(prices),
            'median_price': sorted_prices[len(sorted_prices) // 2],
            'updated_at': datetime.now().isoformat(),
        }

    def save_stats(self, keyword: str, stats: Dict) -> str:
        """
        儲存統計資料

        Args:
            keyword: 搜尋關鍵字
            stats: 統計資料

        Returns:
            文件 ID
        """
        doc_id = keyword.replace(' ', '_').lower()
        stats['updated_at'] = firestore.SERVER_TIMESTAMP

        doc_ref = self.db.collection(self.stats_collection).document(doc_id)
        doc_ref.set(stats, merge=True)

        return doc_id

    def delete_old_cards(self, days: int = 90) -> int:
        """
        刪除超過指定天數的舊資料

        Args:
            days: 天數

        Returns:
            刪除的數量
        """
        from datetime import timedelta

        cutoff = datetime.now() - timedelta(days=days)
        query = self.db.collection(self.cards_collection).where(
            'created_at', '<', cutoff
        ).limit(500)

        deleted = 0
        while True:
            docs = list(query.stream())
            if not docs:
                break

            batch = self.db.batch()
            for doc in docs:
                batch.delete(doc.reference)
                deleted += 1
            batch.commit()

        return deleted


def save_to_firebase(cards: List[Dict], credentials_path: Optional[str] = None) -> int:
    """
    便捷函數：將卡片資料存入 Firebase

    Args:
        cards: 卡片資料列表
        credentials_path: Firebase 憑證檔案路徑

    Returns:
        儲存的數量
    """
    storage = FirebaseStorage(credentials_path)
    count = storage.save_cards_batch(cards)
    print(f"已儲存 {count} 筆資料到 Firebase")
    return count


# ============================================================
# Main (測試用)
# ============================================================

if __name__ == '__main__':
    # 測試連線（需要先設定憑證）
    print("測試 Firebase 連線...")

    # 方法 1: 使用服務帳戶 JSON 檔案
    # storage = FirebaseStorage('path/to/serviceAccount.json')

    # 方法 2: 使用環境變數
    # export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccount.json"
    # storage = FirebaseStorage()

    print("請設定 Firebase 憑證後再執行測試")
    print("\n使用方式:")
    print("  1. 下載 Firebase 服務帳戶 JSON")
    print("  2. 設定環境變數或傳入路徑")
    print("  3. 執行 save_to_firebase(cards)")
