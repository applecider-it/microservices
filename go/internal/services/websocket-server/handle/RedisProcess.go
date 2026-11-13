package handle

import (
	"encoding/json"
	"fmt"

	"myapp/internal/services/websocket-server/types"

	"github.com/go-redis/redis/v8"
)

// Redis Pub/Subの処理
func RedisProcessMain(h *WSHandler) {
	fmt.Println("begin redisProcess")

	redisSub := h.Rdb.Subscribe(h.Ctx, h.Config.RedisPubSubChannel)
	defer redisSub.Close()

	ch := redisSub.Channel()

	roopProccessRedis(h, ch)
}

// redisのループ処理
func roopProccessRedis(h *WSHandler, ch <-chan *redis.Message) {

	for msg := range ch {
		// メッセージを受け取った時

		fmt.Printf("redisProcess Received: %s\n", msg.Payload)
		var redisData types.RedisReceivedData

		err := json.Unmarshal([]byte(msg.Payload), &redisData)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}

		fmt.Printf("Channel: %s, Json: %s\n", redisData.Channel, redisData.Json)

		// 送信用ユーザー情報に変換
		sender := types.ClientSimple{
			Channel: redisData.Channel,
		}

		receivedData := types.ReceivedData{
			Json: redisData.Json,
		}

		fmt.Println(sender)
		fmt.Println(receivedData)

		// チャネル broadcast にメッセージを送る（送信処理へ渡す）
		h.Broadcast <- types.BroadcastPayload{
			Received: receivedData,
			Sender:   sender,
		}
	}
}
