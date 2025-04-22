package server

import (
	"context"
	"encoding/json"
	"log"
	"pxyai/llm-services/model-router/internal/middlewares"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
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
	app.Use(middlewares.ErrorMiddleware()) // 错误处理
	app.Use(cors.New())                    // CORS
	app.Use(recover.New())                 // 注册错误恢复中间件
	app.Use(requestid.New())               // RequestID
	return app
}

// StartHttpServer 启动 HTTP 服务器
func StartHttpServer(app *fiber.App, Addr string) error {
	log.Printf("Starting server on port %s", Addr)
	return app.Listen(Addr)
}

// ShutdownHttpServerWithContext 优雅关闭服务器
func ShutdownHttpServerWithContext(app *fiber.App, ctx context.Context) error {
	log.Println("Shutting down server gracefully...")
	return app.ShutdownWithContext(ctx)
}
