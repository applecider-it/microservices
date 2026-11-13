/*
WebSocketサーバーのセットアップ

このプログラムがやっていること

・Go で WebSocket サーバーを立てる
・ブラウザなどから WebSocket 接続されたユーザー全員を管理し
・誰かが送ったメッセージを全員に配信（チャット）できるようにする
*/

package setup

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"myapp/internal/config"
	"myapp/internal/services/system"
	"myapp/internal/services/websocket-server/handle"
)

// WebSocketサーバーのセットアップ
func SetupWebSocketServer() {
	fmt.Println("begin main")

	system.SetupApp()

	cfg := config.Load()

	wsHandler := handle.NewWSHandler(cfg)

	// Gorilla Mux でルーティング
	router := mux.NewRouter()

	setupRoute(router, wsHandler)
	startGoroutines(wsHandler)

	fmt.Println("Server started on " + cfg.WebSocket.Url)
	log.Fatal(http.ListenAndServe(cfg.WebSocket.Url, router)) // サーバー起動
}

// ルート設定
func setupRoute(router *mux.Router, wsHandler *handle.WSHandler) {
	router.HandleFunc("/ws", wsHandler.HandleConnections) // /ws にアクセスされたら WebSocket 接続
}

// ゴルーチン開始
func startGoroutines(wsHandler *handle.WSHandler) {
	// メッセージ配信処理を 別ゴルーチンで並列に実行
	go wsHandler.HandleMessages()

	// Redis購読をゴルーチンで並列実行
	go wsHandler.RedisProcess()
}
