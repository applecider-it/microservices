/*
WebSocketサーバーのエントリーポイント
*/

package main

import (
	"myapp/internal/services/websocket-server/setup"
)

// main 関数
func main() {
	setup.SetupWebSocketServer()
}
