package model

import (
	"time"
)

type ApiKey struct {
	ID         int32      `gorm:"column:id;type:integer;primaryKey;autoIncrement:true" json:"id"`
	Name       string     `gorm:"column:name;type:character varying(255);not null" json:"name"`
	OpenUserID string     `gorm:"column:open_user_id;type:character varying(32);not null;index:idx_api_key_open_user_id,priority:1" json:"open_user_id"`
	Key        string     `gorm:"column:key;type:character varying(255);not null;index:idx_api_key_key,priority:1" json:"key"`
	Status     int32      `gorm:"column:status;type:integer;not null" json:"status"`
	CreatedAt  *time.Time `gorm:"column:created_at;type:timestamp with time zone;default:now()" json:"created_at"`
	ExpiresAt  *time.Time `gorm:"column:expires_at;type:timestamp with time zone" json:"expires_at"`
}

func (ApiKey) TableName() string {
	return "api_key"
}
