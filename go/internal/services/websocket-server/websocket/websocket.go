package websocket

import (
	"net/http"

	"github.com/gorilla/websocket"
)

// WebSocket 関係の設定
//
// HTTP 通信を WebSocket に“アップグレード”するための設定。
//
// CheckOrigin で true を返しているので、どこからの接続でも許可（開発用）。
var Upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}
