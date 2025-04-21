package middlewares

import (
	"pxyai/llm-services/model-router/internal/services"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

// AuthMiddleware API Key 认证中间件
func AuthMiddleware(apiKeyService services.ApiKeyService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "invalid authorization",
			})
		}

		//查询API Key
		parts := strings.SplitN(authHeader, "Bearer ", 2)
		if len(parts) != 2 {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "invalid authorization header format",
			})
		}
		key := parts[1]
		//验证API Key
		apiKey, err := apiKeyService.GetApiKeyByKey(key)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "invalid api key",
			})
		}
		if apiKey.Status != 1 {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "invalid api key status",
			})
		}
		if apiKey.ExpiresAt != nil && apiKey.ExpiresAt.Before(time.Now()) {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "api key expired",
			})
		}
		openUserID := apiKey.OpenUserID
		//设置用户ID到上下文
		c.Locals("openUserID", openUserID)
		return c.Next()
	}
}
