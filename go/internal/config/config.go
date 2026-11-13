package config

import (
	"os"
	"strconv"
)

// アプリケーションの設定
type Config struct {
	WebSocket WebSocketConfig
	JwtSecret string
	Redis     RedisConfig
	RailsHost string
	// ブロードキャスト用Redis pub/subチャンネル
	RedisPubSubChannel string
}

// WebSocket設定
type WebSocketConfig struct {
	Url string
}

// Redis設定
type RedisConfig struct {
	Addr string
	DB   int
}

// アプリケーションの設定を返す
func Load() *Config {
	redisDB, _ := strconv.Atoi(os.Getenv("APP_REDIS_DB"))

	return &Config{
		WebSocket: WebSocketConfig{
			Url: ":3030",
		},

		JwtSecret: os.Getenv("APP_JWT_SECRET"),

		Redis: RedisConfig{
			Addr: os.Getenv("APP_REDIS_ADDR"),
			DB:   redisDB,
		},

		RailsHost: os.Getenv("APP_RAILS_HOST"),

		RedisPubSubChannel: "broadcast",
	}
}
