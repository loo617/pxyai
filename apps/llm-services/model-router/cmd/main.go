package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"pxyai/llm-services/model-router/internal/app"
	"syscall"
	"time"
)

func main() {

	configPath := os.Getenv("CONFIG_PATH")
	if configPath == "" {
		env := os.Getenv("APP_ENV")
		if env == "" {
			env = "dev"
		}
		configPath = "./internal/config/config-" + env + ".yaml" // fallback 用于本地开发
	}
	log.Printf("loaded config filepath: %s", configPath)

	// 初始化应用
	application, err := app.NewApplication(configPath)
	if err != nil {
		log.Fatalf("Failed to initialize application: %v", err)
	}
	defer application.Cleanup()

	// 启动服务
	go func() {
		if err := application.Start(); err != nil {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// 优雅关机处理
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := application.Shutdown(ctx); err != nil {
		log.Printf("Error during server shutdown: %v", err)
	}

}
