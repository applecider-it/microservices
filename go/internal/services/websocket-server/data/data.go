package data

import (
	"myapp/internal/config"

	"github.com/go-redis/redis/v8"
)

// Redisクライアントを返す
func GetRedis(cfg *config.Config) *redis.Client {
	rdb := redis.NewClient(&redis.Options{
		Addr: cfg.Redis.Addr,
		DB:   cfg.Redis.DB,
	})

	return rdb
}
