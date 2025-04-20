package routes

import (
	"pxyai/llm-services/model-router/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

// RegisterApiKeyRoutes 注册 API Key 相关路由
func RegisterChatRoutes(router fiber.Router, handler *handlers.ChatHandler) {
	// 应用认证中间件
	//router.Use(middleware.AuthMiddleware())

	router.Post("/chat/completions", handler.Chat)
}
