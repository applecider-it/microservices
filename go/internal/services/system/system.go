package system

import (
	"log"

	"github.com/joho/godotenv"
)

// アプリケーションのセットアップ
func SetupApp() {
	// .env を読み込む
	if err := godotenv.Load(); err != nil {
		log.Println(".env file not found, using system environment variables")
	}
}
