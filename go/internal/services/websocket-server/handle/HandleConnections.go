package handle

import (
	"fmt"
	"log"
	"net/http"

	"myapp/internal/services/websocket-server/auth"
	"myapp/internal/services/websocket-server/types"
	mywebsocket "myapp/internal/services/websocket-server/websocket"

	"github.com/gorilla/websocket"
)

// WebSocket の接続を処理する関数
func HandleConnectionsMain(h *WSHandler, w http.ResponseWriter, r *http.Request) {
	tokenString := r.URL.Query().Get("token")

	fmt.Printf("Connection: tokenString=%s\n", tokenString)

	userID, email, channel, err := auth.AuthenticateToken(tokenString, h.Config.JwtSecret)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	fmt.Printf("Connected user: ID=%d, Email=%s channel=%s\n", userID, email, channel)

	ws, err := mywebsocket.Upgrader.Upgrade(w, r, nil) // WebSocketへ変換
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()

	// 接続ユーザー情報を保存
	client := &types.Client{
		Conn:        ws,
		UserID:      userID,
		Email:       email,
		TokenString: tokenString,
		Channel:     channel,
	}
	h.Clients[client] = true

	roopProccessWebSocket(h, ws, client)
}

// ループ処理
func roopProccessWebSocket(h *WSHandler, ws *websocket.Conn, client *types.Client) {
	// 永久ループで WebSocket からデータを受け取る。
	for {
		var receivedData types.ReceivedData
		err := ws.ReadJSON(&receivedData) // JSONが届くのを待つ（待ち受け）
		if err != nil {
			log.Printf("error: ReadJSON: %v", err)
			delete(h.Clients, client)
			break
		}

		fmt.Printf("Received data: json=%s, userID=%d, email=%s\n",
			receivedData.Json, client.UserID, client.Email)

		// WebSocket からの送信は無効化
		fmt.Printf("suspended")
	}
}
