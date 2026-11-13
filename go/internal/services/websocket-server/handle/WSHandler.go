package handle

import (
	"context"
	"net/http"

	"myapp/internal/config"
	"myapp/internal/services/websocket-server/data"
	"myapp/internal/services/websocket-server/types"

	"github.com/go-redis/redis/v8"
)

type WSHandler struct {
	Config *config.Config
	// 参加中のクライアントを保存する変数
	//
	// 接続している WebSocket オブジェクトを map で管理。
	// bool は使っていないが、値をセットできるために使っているだけ（セットの代わり）。
	Clients map[*types.Client]bool
	// メッセージを送るためのチャネル
	//
	// 誰かから受け取ったメッセージを「全員に送る」ための通信用チャネル。
	Broadcast chan types.BroadcastPayload

	Ctx context.Context
	Rdb *redis.Client
}

func NewWSHandler(cfg *config.Config) *WSHandler {
	return &WSHandler{
		Config:    cfg,
		Clients:   make(map[*types.Client]bool),
		Broadcast: make(chan types.BroadcastPayload),
		Ctx:       context.Background(),
		Rdb:       data.GetRedis(cfg),
	}
}

// WebSocket の接続を処理する関数
func (h *WSHandler) HandleConnections(w http.ResponseWriter, r *http.Request) {
	HandleConnectionsMain(h, w, r)
}

// Redis Pub/Subの処理
func (h *WSHandler) RedisProcess() {
	RedisProcessMain(h)
}

// メッセージを全員に送信する関数
func (h *WSHandler) HandleMessages() {
	HandleMessagesMain(h)
}
