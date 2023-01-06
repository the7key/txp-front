## Requirements

- [Node.js 14.x](https://nodejs.org/en/)
- npm 7.x

## Commands

| command          | description                     |
| :--------------- | :------------------------------ |
| `npm start`      | 開発用サーバーの立ち上げ        |
| `npm run build`  | ビルド                          |
| `npm run lint`   | eslint を実行                   |
| `npm run format` | prettier でのフォーマットを実行 |
| `npm run tsc`    | typescript の型チェックを実行   |
| `npm run test`   | テストを実行                    |

## Deploy

```bash
npm run build:staging
npm run deploy -- --profile ***
```
