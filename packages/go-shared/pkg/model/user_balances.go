package model

import (
	"time"
)

type UserBalance struct {
	ID         int32      `gorm:"column:id;type:integer;primaryKey;autoIncrement:true" json:"id"`
	OpenUserID string     `gorm:"column:open_user_id;type:character varying(32);not null;index:idx_user_balances_open_user_id,priority:1" json:"open_user_id"`
	Balance    int64      `gorm:"column:balance;type:bigint;not null" json:"balance"`
	Currency   *string    `gorm:"column:currency;type:character varying(10);not null;default:USD" json:"currency"`
	UpdatedAt  *time.Time `gorm:"column:updated_at;type:timestamp without time zone;not null;default:now()" json:"updated_at"`
}

func (UserBalance) TableName() string {
	return "user_balance"
}
