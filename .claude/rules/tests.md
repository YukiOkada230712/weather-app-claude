---
paths:
  - "src/__tests__/**/*.test.tsx"
  - "src/__tests__/**/*.test.ts"
---

# テスト作業ルール

このルールはテストファイルを扱うときだけ自動で適用されます。

## テストケースの必須項目
1. 正常系：コンポーネントが正しくレンダリングされること
2. 異常系：APIエラー時にエラーメッセージが表示されること
3. インタラクション：ユーザー操作（クリック等）への反応

## モックの書き方
```typescript
import { vi } from 'vitest'

// fetch のモック
global.fetch = vi.fn()
const mockFetch = fetch as ReturnType<typeof vi.fn>

beforeEach(() => {
  mockFetch.mockReset()
})
```

## テストの実行
```bash
npm run test          # 全テスト実行
npm run test:coverage # カバレッジ計測
```