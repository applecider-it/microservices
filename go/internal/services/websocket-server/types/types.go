package types

import (
	"github.com/gorilla/websocket"
)

// WebSocket 接続情報とユーザー情報をまとめて保存
type Client struct {
	Conn        *websocket.Conn
	UserID      int
	Email       string
	TokenString string
	Channel     string
}

// ブロードキャスト用のシンプルなユーザー情報
type ClientSimple struct {
	Channel string
}

// 受信データの型定義
//
// JSON で受け取り・送信するためのデータ形式。
type ReceivedData struct {
	Json string `json:"json"` // JSON文字列
}

// ブロードキャスト用
type BroadcastPayload struct {
	Received ReceivedData
	Sender   ClientSimple
}

// Redisの受信データの型定義
type RedisReceivedData struct {
	Json    string `json:"json"`    // JSON文字列
	Channel string `json:"channel"` // JSON文字列
}
