package logger

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"pxyai/llm-services/model-router/internal/config"
	"time"

	"github.com/rs/zerolog"
	"gopkg.in/natefinch/lumberjack.v2"
)

var logInstance zerolog.Logger

func InitLogger(cfg *config.Config) {
	if cfg.App.IsDev() {
		writer := zerolog.ConsoleWriter{
			Out: os.Stdout,
			FormatTimestamp: func(i interface{}) string {
				return time.Now().Format("2006-01-02 15:04:05.000")
			},
		}
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
		logInstance = zerolog.New(writer).With().Timestamp().Logger()
	} else {
		// 日志文件（每天一个文件，保留 7 天）
		exePath, err := os.Executable()
		if err != nil {
			log.Fatal(err)
		}
		exeDir := filepath.Dir(exePath)
		logDir := filepath.Join(exeDir, "logs")
		_ = os.MkdirAll(logDir, os.ModePerm)

		currentDate := time.Now().Format("2006-01-02")
		logFilePath := filepath.Join(logDir, currentDate+".log")

		fmt.Print(logFilePath)

		fileWriter := &lumberjack.Logger{
			Filename: logFilePath,
			MaxSize:  100, // 单个文件最大 MB
			MaxAge:   7,   // 保留天数
			Compress: false,
		}
		zerolog.TimeFieldFormat = "2006-01-02T15:04:05.000Z07:00" // ISO8601 格式，带毫秒
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
		logInstance = zerolog.New(fileWriter).With().Timestamp().Logger()
	}
}

func Get() *zerolog.Logger {
	return &logInstance
}
