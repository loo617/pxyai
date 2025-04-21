package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB gorm connector
func NewDatabase(dsn string) (*gorm.DB, error) {
	return gorm.Open(postgres.Open(dsn), &gorm.Config{})
}
