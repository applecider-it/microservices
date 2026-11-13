# Goマイクロサービス

## ディレクトリ構成

```
bin/ ビルド結果出力先
cmd/ エントリーポイント
internal/ ソース
  config/ <- 設定
  services/ <- ビジネスロジックなど
    (カテゴリーごとにディレクトリを分けて、そのなかにサービスクラスを配置している)
```

## 概要

websocket連携の仲介。

認証はJWTを使う。

Redis Pub/Sub連携のみで動作する。

## チャンネル名の定義

`channelname:param1,param2...`

## コネクション時のパラメーター

| 項目名 | 内容 | 型 | 詳細 |
|--------|--------|--------|--------|
| token | 認証情報を含むJWTトークン | string |  |

## token

| 項目名 | 内容 | 型 | 詳細 |
|--------|--------|--------|--------|
| user_id | ユーザーID | integer |  |
| email | メールアドレス | string |  |
| channel | 接続するチャンネル | string | つまり、同時に複数のチャンネルには接続できない。 |
| exp | 有効期限 | integer |  |
| iat | 現在日時 | integer |  |

## Redis Pub/Sub連携

Pub/Subのチャンネル名: broadcast

```
{
  channel: string, <- WebSocketチャンネル名
  json: string,
}
```

| 項目名 | 内容 | 型 | 詳細 |
|--------|--------|--------|--------|
| json | Jsonデータ | string | 各チャンネルごとに別々の値が入る |


## ブロードキャスト時

```
{
  data: {
    json: string
  },
}
```
