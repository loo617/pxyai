package model

import (
	"time"
)

type OpenUser struct {
	ID         int32      `gorm:"column:id;type:integer;primaryKey;autoIncrement:true" json:"id"`
	OpenUserID string     `gorm:"column:open_user_id;type:character varying(32);not null;index:idx_open_user_id,priority:1" json:"open_user_id"`
	Email      string     `gorm:"column:email;type:character varying(255);not null" json:"email"`
	Password   string     `gorm:"column:password;type:character varying(255);not null" json:"password"`
	IsActive   *int32     `gorm:"column:is_active;type:integer;not null;default:1" json:"is_active"`
	CreatedAt  *time.Time `gorm:"column:created_at;type:timestamp with time zone;not null;default:now()" json:"created_at"`
	UpdatedAt  *time.Time `gorm:"column:updated_at;type:timestamp with time zone;not null;default:now()" json:"updated_at"`
}

func (OpenUser) TableName() string {
	return "open_user"
}
