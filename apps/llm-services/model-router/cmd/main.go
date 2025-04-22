package main

import (
	"context"
	"os"
	"os/signal"
	"pxyai/llm-services/model-router/internal/app"
	"pxyai/llm-services/model-router/internal/config"
	"pxyai/llm-services/model-router/internal/logger"
	"syscall"
	"time"
)

func main() {

	// Get configuration path from environment or use default
	configPath := os.Getenv("CONFIG_PATH")

	// Load configuration
	cfg, err := config.LoadConfig(configPath)
	if err != nil {
		logger.Get().Fatal().Msgf("Failed to load configuration: %v", err)
	}

	//初始化日志配置
	logger.InitLogger(cfg)
	logger.Get().Info().Msgf("Configuration loaded: %+v", cfg)

	// 初始化应用
	application, err := app.NewApplication(cfg)
	if err != nil {
		logger.Get().Fatal().Msgf("Failed to initialize application: %v", err)
	}
	defer application.Cleanup()

	// 启动服务
	go func() {
		if err := application.Start(); err != nil {
			logger.Get().Fatal().Msgf("Server failed to start: %v", err)
		}
	}()

	// 优雅关机处理
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := application.Shutdown(ctx); err != nil {
		logger.Get().Error().Msgf("Error during server shutdown: %v", err)
	}
}
