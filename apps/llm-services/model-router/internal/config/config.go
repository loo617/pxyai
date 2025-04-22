package config

import (
	"fmt"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	App      AppConfig      `mapstructure:"app"`
	Database DatabaseConfig `mapstructure:"database"`
	Redis    RedisConfig    `mapstructure:"redis"`
	Server   ServerConfig   `mapstructure:"server"`
}

var Cfg *Config

func LoadConfig(configPath string) (*Config, error) {

	if configPath == "" {
		//默认配置文件
		configPath = "./internal/config/config-dev.yaml"
	}

	// Configure viper
	viper.SetConfigFile(configPath)
	viper.AutomaticEnv()

	// Read the config file
	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("failed to read config file %s: %w", configPath, err)
	}

	// Unmarshal into Config struct
	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("failed to parse config file: %w", err)
	}
	// Store globally
	Cfg = &cfg

	return &cfg, nil
}

type AppConfig struct {
	Env string `mapstructure:"env"`
}

func (a AppConfig) IsDev() bool {
	return a.Env == "dev"
}

type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     uint64 `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	DBName   string `mapstructure:"dbname"`
	SSLMode  string `mapstructure:"ssl_mode"`
}

func (d DatabaseConfig) DSN() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		d.Host,
		d.Port,
		d.User,
		d.Password,
		d.DBName,
		d.SSLMode,
	)
}

type RedisConfig struct {
	Address           string        `mapstructure:"address"`
	Password          string        `mapstructure:"password"`
	DB                int           `mapstructure:"db"`
	UrlDuration       time.Duration `mapstructure:"url_duration"`
	EmailCodeDuration time.Duration `mapstructure:"email_code_duration"`
}

type ServerConfig struct {
	Addr string `mapstructure:"addr"`
}
