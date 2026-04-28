# GeoGesser Clone (Guest + OAuth)

GeoGuessr風のミニゲームです。Google Street View を見て現在地を推測し、地図上でクリックしてスコアを競います。

## 機能

- 🎮 1ラウンドごとの推測ゲーム
- 🧭 地図クリックで回答
- 📏 距離に応じたスコア算出
- 👤 ゲストモード（匿名）
- 🔐 Google / Facebook / X(Twitter) ログイン
- ☁️ Firestore へユーザーごとの自己ベスト保存

## セットアップ

1. Firebase プロジェクトを作成
2. Authentication で以下のプロバイダを有効化
   - Anonymous
   - Google
   - Facebook
   - Twitter（X）
3. Firestore Database を有効化
4. `firebase-config.js` の値を埋める
5. Google Maps JavaScript API キーを `index.html` に設定

```html
<script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initStreetView"></script>
```

6. ローカル起動

```bash
python3 -m http.server 5173
```

ブラウザで `http://localhost:5173` を開いてください。

## Firestore 例ルール

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## 注意

- Street View の表示には課金設定された Google Cloud プロジェクトが必要です。
- OAuth（Facebook / X）には各プロバイダ側でリダイレクト URI 設定が必要です。
