package server

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

// NewHttpServer 创建并配置新的 Fiber 应用
func NewHttpServer() *fiber.App {
	app := fiber.New(fiber.Config{
		JSONEncoder:           json.Marshal,
		JSONDecoder:           json.Unmarshal,
		AppName:               "Model Router API",
		ReadTimeout:           10 * time.Second,
		WriteTimeout:          10 * time.Second,
		DisableStartupMessage: true,
	})
	// 注册基础中间件
	app.Use(
		logger.New(), // 日志
	)

	return app
}

// StartHttpServer 启动 HTTP 服务器
func StartHttpServer(app *fiber.App, port string) error {
	log.Printf("Starting server on port %s", port)
	return app.Listen(":" + port)
}

// ShutdownHttpServerWithContext 优雅关闭服务器
func ShutdownHttpServerWithContext(app *fiber.App, ctx context.Context) error {
	log.Println("Shutting down server gracefully...")
	return app.ShutdownWithContext(ctx)
}
