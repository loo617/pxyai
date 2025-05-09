package app

import (
	"context"
	"fmt"
	"net/http"
	"pxyai/llm-services/model-router/internal/config"
	"pxyai/llm-services/model-router/internal/database"
	"pxyai/llm-services/model-router/internal/handlers"
	"pxyai/llm-services/model-router/internal/middlewares"
	routes "pxyai/llm-services/model-router/internal/router"
	"pxyai/llm-services/model-router/internal/server"
	"pxyai/llm-services/model-router/internal/services"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type Application struct {
	app    *fiber.App
	db     *gorm.DB
	config *config.Config
}

// 创建并初始化应用
func NewApplication(cfg *config.Config) (*Application, error) {

	// 初始化数据库
	db, err := initDatabase(cfg.Database)
	if err != nil {
		return nil, fmt.Errorf("database initialization failed: %w", err)
	}

	// 初始化服务
	apiKeyService := services.NewApiKeyService(db)
	modelService := services.NewModelService(db)
	providerService := services.NewProviderService(db)

	// 初始化HTTP服务器
	app := server.NewHttpServer()

	// 注册全局中间件
	app.Use(middlewares.ErrorMiddleware())

	// 注册无需鉴权的路由（如健康检查）
	app.Get("/health", func(c *fiber.Ctx) error {
		c.JSON(fiber.Map{
			"status": "ok",
			"code":   http.StatusOK,
			"data":   nil,
		})
		return nil
	})

	// 初始化处理器
	chatHandler := handlers.NewChatHandler(apiKeyService, modelService, providerService)

	// 需要鉴权的业务路由
	v1 := app.Group("/v1", middlewares.AuthMiddleware(apiKeyService))
	{
		api := v1.Group("/api")
		routes.RegisterChatRoutes(api, chatHandler)
	}

	return &Application{
		app:    app,
		db:     db,
		config: cfg,
	}, nil
}

// 启动应用
func (a *Application) Start() error {
	return server.StartHttpServer(a.app, a.config.Server.Addr)
}

// 优雅关闭应用
func (a *Application) Shutdown(ctx context.Context) error {
	return server.ShutdownHttpServerWithContext(a.app, ctx)
}

// Cleanup 清理资源
func (a *Application) Cleanup() {
	// 可以在这里添加资源清理逻辑，如关闭数据库连接等
	if sqlDB, err := a.db.DB(); err == nil {
		sqlDB.Close()
	}
}

// 初始化数据库连接
func initDatabase(cfg config.DatabaseConfig) (*gorm.DB, error) {
	db, err := database.NewDatabase(cfg.DSN())
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	return db, nil
}

// 注册路由
func RegisterRoutes(app *fiber.App,
	chatHandler *handlers.ChatHandler) {
	// 这里不再注册 /health 路由，业务路由由 NewApplication 中完成
	routerGroup := app.Group("/v1")
	{
		//注册chat路由
		chatGroup := routerGroup.Group("/api")
		routes.RegisterChatRoutes(chatGroup, chatHandler)

		// ...
	}
}
