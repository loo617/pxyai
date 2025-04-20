package model

import "time"

type Model struct {
	ID           int32      `gorm:"column:id;type:integer;primaryKey;autoIncrement:true" json:"id"`
	ProviderCode string     `gorm:"column:provider_code;type:character varying(50);not null" json:"provider_code"`
	Model        string     `gorm:"column:model;type:character varying(50);not null" json:"model"`
	Type         int32      `gorm:"column:type;type:integer;not null" json:"type"`
	Version      string     `gorm:"column:version;type:character varying(32);not null" json:"version"`
	Context      int32      `gorm:"column:context;type:integer;not null" json:"context"`
	PriceInput   *float64   `gorm:"column:price_input;type:numeric(10,2);default:0.00" json:"price_input"`
	PriceOutput  *float64   `gorm:"column:price_output;type:numeric(10,2);default:0.00" json:"price_output"`
	Status       int32      `gorm:"column:status;type:integer;not null" json:"status"`
	RateLimit    *int32     `gorm:"column:rate_limit;type:integer;not null;default:1" json:"rate_limit"`
	CreatedAt    *time.Time `gorm:"column:created_at;type:timestamp with time zone;not null;default:now()" json:"created_at"`
	UpdatedAt    *time.Time `gorm:"column:updated_at;type:timestamp with time zone;not null;default:now()" json:"updated_at"`
}

func (Model) TableName() string {
	return "model"
}
