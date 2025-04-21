package model

import (
	"time"
)

type Provider struct {
	ID           int32      `gorm:"column:id;type:integer;primaryKey;autoIncrement:true" json:"id"`
	ProviderCode string     `gorm:"column:provider_code;type:character varying(50);not null" json:"provider_code"`
	ProviderName string     `gorm:"column:provider_name;type:character varying(255);not null" json:"provider_name"`
	Status       int32      `gorm:"column:status;type:integer;not null" json:"status"`
	APIURL       string     `gorm:"column:api_url;type:character varying(255);not null" json:"api_url"`
	APIKey       string     `gorm:"column:api_key;type:character varying(255);not null" json:"api_key"`
	CreatedAt    *time.Time `gorm:"column:created_at;type:timestamp with time zone;not null;default:now()" json:"created_at"`
	UpdatedAt    *time.Time `gorm:"column:updated_at;type:timestamp with time zone;not null;default:now()" json:"updated_at"`
}

func (Provider) TableName() string {
	return "provider"
}
