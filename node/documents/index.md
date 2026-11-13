# Nodeマイクロサービス

websocket連携の仲介。

# 構成

```
app/
  config/ 設定
  entrypoints/ エントリーポイント
  services/ 実体
    カテゴリーごとのディレクトリ/
      サービスクラス実体
  types/ 共通で利用する型
```

# その他

## Typescriptなのに、importでは.jsを拡張子にしている理由

ビルドしたときに、こうしないと動かないから。

