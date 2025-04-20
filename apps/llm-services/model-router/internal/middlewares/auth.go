package middleware

import (
	"github.com/gofiber/fiber/v2"
)

// AuthMiddleware API Key 认证中间件
func AuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		apiKey := c.Get("X-API-Key")
		if apiKey == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "API key is required",
			})
		}

		// TODO: 验证 API Key 逻辑
		// 可以从上下文中获取服务进行验证

		// 示例：设置用户ID到上下文
		c.Locals("openUserID", "user123")

		return c.Next()
	}
}
