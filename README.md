# Shift Scheduler Application

店長とアルバイトスタッフのための、シフト管理効率化アプリケーション。

![Dashboard](/manager_dashboard_1768744140015.png)

## 🌟 特徴

### 店長向け機能 (PC最適化)
- **環境設定**: 店舗ごとのシフトルール（営業時間、必要人数）を柔軟に設定。
- **スタッフ管理**: スタッフ情報の登録・編集、希望条件やNG日の管理。
- **シフト自動生成**: スタッフの希望と店舗の必要人数を考慮したAIシフト生成。
- **共有 & 出力**: 完成したシフトをLINEで共有したり、Excel/PDF形式で出力。

### スタッフ向け機能 (モバイル最適化)
- **カンタン希望提出**: スマホからカレンダーをタップするだけでシフト希望を提出。
- **マイパターン**: よく使うシフト（例: "いつもの早番"）をテンプレート化して保存。

## 🛠 技術スタック

- **Frontend**: Next.js 14, Tailwind CSS, Lucide React
- **Backend**: Python (Flask), MySQL
- **Testing**: Playwright (E2E), GitHub Actions (CI)
- **Infrastructure**: Docker Compose

## 🚀 始め方

### 必要条件
- Docker Desktop がインストールされていること

### 起動方法

1. リポジトリをクローンまたはダウンロードします。
2. ディレクトリに移動し、Dockerコンテナを起動します。

```bash
docker-compose up --build
```

起動後、以下のURLでアクセスできます：

- **店長用画面**: [http://localhost:3000/manager](http://localhost:3000/manager)
- **スタッフ用画面**: [http://localhost:3000/staff/calendar](http://localhost:3000/staff/calendar)
- **ログイン画面**: [http://localhost:3000/login](http://localhost:3000/login)

## 🧪 テスト

PlaywrightによるE2Eテストが含まれています。

```bash
cd shift-web
npx playwright test
```

## 📁 プロジェクト構成

```
.
├── shift-web/          # Next.js フロントエンド
│   ├── app/            # App Router ページ
│   ├── components/     # UIコンポーネント
│   ├── lib/            # APIクライアント
│   └── e2e/            # Playwright テスト
├── shift-api/          # Flask バックエンド
│   ├── app/            # アプリケーションロジック
│   │   ├── routers/    # APIエンドポイント
│   │   └── services/   # ビジネスロジック
│   └── run.py          # エントリーポイント
└── docker-compose.yml  # コンテナ構成
```
