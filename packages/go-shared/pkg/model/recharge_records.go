package model

import (
	"time"
)

type RechargeRecord struct {
	ID            int32      `gorm:"column:id;type:integer;primaryKey;autoIncrement:true" json:"id"`
	OpenUserID    string     `gorm:"column:open_user_id;type:character varying(32);not null;index:idx_recharge_records_open_user_id,priority:1" json:"open_user_id"`
	Amount        int64      `gorm:"column:amount;type:bigint;not null" json:"amount"`
	Currency      *string    `gorm:"column:currency;type:character varying(10);not null;default:USD" json:"currency"`
	Method        *string    `gorm:"column:method;type:character varying(50)" json:"method"`
	Status        int32      `gorm:"column:status;type:integer;not null" json:"status"`
	ReferenceID   *string    `gorm:"column:reference_id;type:character varying(255)" json:"reference_id"`
	Metadata      *string    `gorm:"column:metadata;type:jsonb" json:"metadata"`
	BalanceBefore int64      `gorm:"column:balance_before;type:bigint;not null" json:"balance_before"`
	BalanceAfter  int64      `gorm:"column:balance_after;type:bigint;not null" json:"balance_after"`
	CreatedAt     *time.Time `gorm:"column:created_at;type:timestamp without time zone;not null;default:now()" json:"created_at"`
}

func (RechargeRecord) TableName() string {
	return "recharge_records"
}
