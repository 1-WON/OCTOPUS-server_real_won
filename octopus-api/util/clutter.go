package util

import (
	"encoding/base64"
	"github.com/google/uuid"
	"math/rand"
	"strings"
)

func GenerateRandomString(length int) string {
	var out strings.Builder
	charSet := []byte("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

	for i := 0; i < length; i++ {
		random := rand.Intn(len(charSet))
		randomChar := charSet[random]
		out.WriteString(string(randomChar))
	}
	return out.String()
}

func Base64Encoding(in string) string {
	if in == "" {
		return in
	}
	out := base64.StdEncoding.EncodeToString([]byte(in))

	return out
}

func GenerateUUID() string {
	uid := uuid.New()
	return uid.String()
}
