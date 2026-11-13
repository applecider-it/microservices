package auth

import (
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

// JWTトークンを検証して userID, email, channel を返す
func AuthenticateToken(tokenString string, jwtSecret string) (int, string, string, error) {
	if tokenString == "" {
		return 0, "", "", fmt.Errorf("token required")
	}

	// サーバー側で共有する秘密鍵
	var jwtSecretByte []byte = []byte(jwtSecret)

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecretByte, nil
	})

	if err != nil || !token.Valid {
		return 0, "", "", fmt.Errorf("invalid token")
	}

	// トークンからデータを取り出す
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, "", "", fmt.Errorf("invalid claims")
	}

	// user_id は float64 で来るので int に変換
	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		return 0, "", "", fmt.Errorf("invalid user_id in token")
	}
	userID := int(userIDFloat)

	email, ok := claims["email"].(string)
	if !ok {
		return 0, "", "", fmt.Errorf("invalid email in token")
	}

	channel, ok := claims["channel"].(string)
	if !ok {
		return 0, "", "", fmt.Errorf("invalid channel in token")
	}

	return userID, email, channel, nil
}
