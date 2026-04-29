# GeoGuessr Evolution Prototype

## 概要
GeoGuessrを発展させたWebアプリのプロトタイプです。React + TypeScript + Viteで、ゲーム体験の中核（ラウンド遷移、推測地点選択、距離スコア計算）を段階的に実装しています。

## セットアップ方法
```bash
npm install
```

## 起動方法
```bash
npm run dev
```

## ビルド方法
```bash
npm run build
```

## 現在の実装
- React Routerによる3画面遷移（`/` Home, `/game` Game, `/result` Result）
- ゲーム状態管理（Round / Score / Timer / CurrentQuestion）
- 固定JSONの問題モデル（`id, lat, lng, panoId, country, difficulty`）
- 地図UIの最小実装（クリックで推測地点を配置）
- Haversine距離 + スコア計算ユーティリティ
- ゲスト認証方針の先行実装（匿名ログイン想定フラグ）
- 成績保持（セッション内のラウンド履歴）

## 今後の開発予定
- 実地図ライブラリ（Leaflet / Google Maps）への置き換え
- Firebase Auth（匿名 / Google / Facebook / X）連携
- Firestore永続化（`users/{uid}/games` など）
- lint/testの導入と品質ゲート強化
