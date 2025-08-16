# シフト調整アプリ（店長向け × スマホ提出 × AI割当）

店長の「毎月のシフト作り」を効率化する Web アプリ。  
スマホ（iOS/Android）＋ LINE ログイン前提でメンバーがまとめて希望提出、店長は締切管理 → AI 自動調整 → Excel 出力まで実行できます。

---

## 目次
- [決定事項](#決定事項)
- [機能概要-mvp](#機能概要-mvp)
- [画面イメージ](#画面イメージ)
- [excel-の例列日付行人](#excel-の例列日付行人)
- [アーキテクチャ](#アーキテクチャ)
- [ディレクトリ構成](#ディレクトリ構成)
- [セットアップ--起動](#セットアップ--起動)
- [api-仕様実装済み](#api-仕様実装済み)
- [db-スキーマ](#db-スキーマ)
- [ai-割当mvp-方針](#ai-割当mvp-方針)
- [excel-出力](#excel-出力)
- [認証権限ロードマップ](#認証権限ロードマップ)
- [コマンド集](#コマンド集)
- [トラブルシューティング](#トラブルシューティング)
- [ロードマップ](#ロードマップ)
- [ライセンス--貢献](#ライセンス--貢献)
- [付録サンプル-postcurl](#付録サンプル-postcurl)

---

## 決定事項
- 他メンバーの希望表示: **個人名あり**で全員に見える（透明性重視）
- スロット: 当面は固定テンプレ（例: 9–13 / 13–18 / 18–22）
- Excel レイアウト: **列＝日付、行＝人**（横に日付／縦に人）
- AI ロジック: MVP は **貪欲 + 調整**（将来 OR-Tools 等で高度化）

---

## 機能概要 (MVP)
- 店長: 対象月（例: 8月）の期間を作成、**締切**と**スロット必要人数**を設定
- メンバー: LINE ログイン後、**範囲/曜日/時間帯パターン**で**まとめて希望提出**（締切まで何度でも修正可）
- 他メンバーの希望を閲覧（個人名＋ステータス）
- 締切後、店長が **AI 自動調整** → 手動微調整 → **Excel 出力**

---

## 画面イメージ
- メンバー（スマホ）
  - まとめ入力フォーム（日付・開始・終了・希望度）
  - 他メンバーの希望一覧（個人名＋ステータス）
- 店長（PC）
  - 期間作成・締切設定・スロット必要人数設定
  - 希望集計ダッシュボード
  - AI 割当／微調整
  - Excel 出力

---

## Excel の例（列＝日付、行＝人）
横に日付／縦に人の例です。

| 人＼日付 | 1日 | 2日 | 3日 | 4日 | 5日 |
|---------|-----|-----|-----|-----|-----|
| Aさん    | ○   | ×   | ○   |     | △   |
| Bさん    | ×   | ○   | △   | ○   |     |
| Cさん    | ○   | △   | ×   | ○   | ○   |

---

## アーキテクチャ
- Frontend: Next.js（App Router, TypeScript 推奨／現状 JS も可）
- Backend: Flask（Python）
- DB: MySQL
- 認証: LINE ログイン（LIFF）予定（開発中は `line_user_id="dev-user"` 固定）
- 開発環境: Docker Compose（`db` / `api` / `web`）

Client(スマホ/PC)
└─ HTTP → Next.js (web:3000)
└─ REST → Flask API (api:8000)
└─ SQL → MySQL (db:3306)

---

## ディレクトリ構成
shift/
├─ .devcontainer/
│ └─ docker-compose.yml # db / api / web
├─ shift-api/
│ ├─ app.py # Flask（/api/*）
│ ├─ requirements.txt
│ └─ Dockerfile
└─ shift-web/
├─ package.json
├─ next.config.js
├─ Dockerfile
└─ app/
└─ availability/
└─ page.(tsx|jsx) # まとめ入力フォーム

```bash
cd ./.devcontainer
docker compose build --no-cache
docker compose up -d
docker compose ps

2) 初回のみ: DB テーブル作成
bash
コピーする
編集する
docker compose exec db mysql -uuser -ppass app -e "
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  line_user_id VARCHAR(64) UNIQUE,
  role ENUM('manager','crew') DEFAULT 'crew',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS availabilities (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  date DATE NOT NULL,
  start_dt DATETIME NOT NULL,
  end_dt DATETIME NOT NULL,
  status ENUM('prefer','can','cannot') NOT NULL DEFAULT 'can',
  note VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_slot (user_id, start_dt, end_dt),
  INDEX(user_id), INDEX(date)
);
"
3) 動作確認
bash
コピーする
編集する
# API
curl http://localhost:8000/health
# => {"ok": true}

# フロント（ブラウザで開く）
# http://localhost:3000/availability
API 仕様（実装済み）
GET /health
監視用。{"ok": true} を返す。

POST /api/availabilities
希望の一括登録（UPSERT: 同一時間枠は更新扱い）

Request (JSON)

{
  "line_user_id": "dev-user",
  "items": [
    {
      "date": "2025-08-15",
      "start": "2025-08-15T09:00:00",
      "end":   "2025-08-15T13:00:00",
      "status": "prefer"
    }
  ]
}
Response
201 Created
{ "ok": true }
※ DB 側に UNIQUE KEY (user_id, start_dt, end_dt) を設定しているため、同じ枠は更新に切り替わります。

GET /api/availabilities?limit=20
直近の提出を一覧で返す（個人名つき）

Response (例)

[
  {
    "id": 9,
    "name": "Dev User",
    "date": "2025-08-13",
    "start_dt": "2025-08-13T16:12:00",
    "end_dt": "2025-08-13T17:12:00",
    "status": "can",
    "created_at": "2025-08-16T10:13:12"
  }
]
DB スキーマ
既存（MVP）
users: id, name, email, line_user_id(unique), role, created_at

availabilities: id, user_id, date, start_dt, end_dt, status(enum), note, created_at

UNIQUE: (user_id, start_dt, end_dt)（UPSERT 用）

追加予定（店長機能・AI 割当に必要）

CREATE TABLE periods (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  year INT NOT NULL, month INT NOT NULL,
  deadline_at DATETIME NOT NULL,
  is_published TINYINT(1) DEFAULT 0
);

CREATE TABLE slots (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  period_id BIGINT NOT NULL,
  date DATE NOT NULL,
  start_dt DATETIME NOT NULL,
  end_dt DATETIME NOT NULL,
  required_count INT NOT NULL DEFAULT 1,
  note VARCHAR(255),
  INDEX(period_id), INDEX(date)
);

CREATE TABLE assignments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  slot_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  assigned_status ENUM('assigned','backup') DEFAULT 'assigned',
  source ENUM('ai','manual') DEFAULT 'ai',
  score INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_slot_user (slot_id, user_id),
  INDEX(slot_id), INDEX(user_id)
);

CREATE TABLE period_notes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  period_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  note VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
AI 割当（MVP 方針）
目的: 必要人数の充足、prefer > can > cannot の満足度最大化、公平性（割当回数のばらつき抑制）

手順（簡易）

各スロットで prefer を優先して人数充足

足りない場合 can で補完

全体の偏りが大きい箇所を局所交換してスコア改善

将来: OR-Tools（整数計画）で厳密化（最大勤務/連勤/休憩/スキル/コスト等）

Excel 出力
レイアウト: 列＝日付、行＝人（横に日付／縦に人）

セル: 割当（○/×/△ 等）やメモ記号

ヘッダ: 必要人数、充足率、注意事項欄

技術候補: xlsxwriter（Python）

予定 API: GET /api/export/excel?period_id=...（application/vnd.openxmlformats-officedocument.spreadsheetml.sheet）

認証・権限（ロードマップ）
LIFF（LINE ログイン）で line_user_id を取得し users に紐付け

役割: manager（店長）/ crew（メンバー）

店長のみ: 期間作成・締切変更・AI 確定・Excel 出力

全員: 他メンバーの希望閲覧（個人名ありの方針）

コマンド集
# 起動／停止
docker compose up -d
docker compose down

# 状態／ログ
docker compose ps
docker compose logs -f api
docker compose logs -f web
docker compose logs -f db

# API ヘルス
curl http://localhost:8000/health

# DB クエリ
docker compose exec db mysql -uuser -ppass app -e "SHOW TABLES;"
docker compose exec db mysql -uuser -ppass app -e "SELECT * FROM availabilities ORDER BY id DESC LIMIT 5;"
トラブルシューティング
URL をターミナルに打ってしまう → ブラウザのアドレスバーに http://localhost:3000/availability を入力

CORS エラー → 開発中は CORS(app, resources={r"/api/*": {"origins": "*"}}) を維持（本番はドメイン限定）

mysqlclient ビルド失敗 → 開発は PyMySQL を利用（requirements.txt に PyMySQL）。mysqlclient を使う場合は pkg-config / build-essential を追加

VS Code の赤線（Pylance） → Dev Container 内の Python を選択（/usr/local/bin/python）

ロードマップ
フェーズ1（MVP）

まとめ入力（現フォーム）／締切前の再編集

他メンバーの希望一覧（個人名あり）

店長: 期間作成・固定スロットの必要人数設定

簡易 AI 割当（貪欲＋調整）

Excel 出力（列＝日付、行＝人）

フェーズ2（改善）

LINE ログイン／締切・確定通知

店長 UI（ドラッグ＆ドロップ微調整）

スロット柔軟化・スキル要件

OR-Tools 導入・制約最適化

監査ログ、権限強化、バックアップ方針
