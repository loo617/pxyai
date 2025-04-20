package app

import (
	"fmt"
	"pxyai/go-shared/pkg/config"
	"strconv"
)

// Config 应用配置
type Config struct {
	DBHost     string
	DBPort     uint64
	DBUser     string
	DBPassword string
	DBName     string
	Port       string
}

// LoadConfig 从环境变量加载配置
func LoadConfig() (*Config, error) {
	p := config.Config("DB_PORT")
	dbPort, err := strconv.ParseUint(p, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("failed to parse database port: %w", err)
	}
	return &Config{
		DBHost:     config.Config("DB_HOST"),
		DBPort:     dbPort,
		DBUser:     config.Config("DB_USER"),
		DBPassword: config.Config("DB_PASSWORD"),
		DBName:     config.Config("DB_NAME"),
		Port:       config.Config("PORT"),
	}, nil
}
