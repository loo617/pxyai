package middlewares

import (
	"pxyai/llm-services/model-router/internal/logger"
	"time"

	"github.com/google/uuid"

	"github.com/gofiber/fiber/v2"
)

// RequestLoggerMiddleware 记录每次请求的输入和简短输出摘要，附带 request ID
func RequestLoggerMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		// 生成 request ID
		reqID := uuid.NewString()
		c.Locals("request_id", reqID)
		c.Set("X-Request-ID", reqID)

		// 读取请求体
		var bodyCopy []byte
		if c.Request().Body() != nil {
			bodyCopy = c.Body()
		}

		// 执行请求处理逻辑
		err := c.Next()

		// 截取输出内容的前 200 字节
		respBody := c.Response().Body()
		var respSnippet string
		if len(respBody) > 200 {
			respSnippet = string(respBody[:200]) + "..."
		} else {
			respSnippet = string(respBody)
		}

		// 记录日志
		logger.Get().Info().Fields(map[string]interface{}{
			"request_id": reqID,
			"method":     c.Method(),
			"path":       c.OriginalURL(),
			"status":     c.Response().StatusCode(),
			"latency":    time.Since(start).String(),
			"body":       string(bodyCopy),
			"response":   respSnippet,
		}).Msg("HTTP Request")

		return err
	}
}
