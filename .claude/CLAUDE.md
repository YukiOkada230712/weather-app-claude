# 天気ダッシュボード プロジェクトガイド

このファイルは Claude Code が自動で読み込むプロジェクト設定です。

## プロジェクト概要
- Next.js 14 + TypeScript + Tailwind CSS
- Open-Meteo API（無料・APIキー不要）を使用
- 東京・大阪・札幌・福岡・那覇の5都市の天気を表示

## TypeScript ルール
- tsconfig.json の strict: true を必ず維持すること
- any 型の使用を禁止する（unknown または適切な型を使う）
- すべての関数の引数と戻り値に型を明示する

## コンポーネント設計
- Atomic Design パターンを使用する
- atoms/：ボタン・入力欄など単一要素
- molecules/：複数の atoms を組み合わせたもの
- organisms/：ページを構成する大きな単位

## テスト
- テストフレームワーク：Vitest
- テストファイル：src/__tests__/ に配置
- 新規コンポーネントには必ずテストを書く

## API
- Open-Meteo 以外の外部 API を追加する場合は事前に確認すること
- fetch エラーは必ず catch してユーザーに通知する

## コミット規約
- メッセージは日本語で書く
- プレフィックス：feat / fix / refactor / test / docs

## よく使うコマンド
- 開発サーバー起動：npm run dev
- テスト実行：npm run test
- ビルド確認：npm run build