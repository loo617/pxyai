package model

import (
	"time"
)

type ModelLog struct {
	ID                   int32      `gorm:"column:id;type:integer;primaryKey;autoIncrement:true" json:"id"`
	OpenUserID           string     `gorm:"column:open_user_id;type:character varying(32);not null;index:idx_model_logs_open_user_id,priority:1" json:"open_user_id"`
	ProviderCode         string     `gorm:"column:provider_code;type:character varying(50);not null;index:idx_model_logs_provider_code,priority:1" json:"provider_code"`
	Model                string     `gorm:"column:model;type:character varying(50);not null;index:idx_model_logs_model,priority:1" json:"model"`
	InputTokens          int32      `gorm:"column:input_tokens;type:integer;not null" json:"input_tokens"`
	OutputTokens         int32      `gorm:"column:output_tokens;type:integer;not null" json:"output_tokens"`
	TotalTokens          int32      `gorm:"column:total_tokens;type:integer;not null" json:"total_tokens"`
	LatencyMs            int32      `gorm:"column:latency_ms;type:integer;not null" json:"latency_ms"`
	Status               *int32     `gorm:"column:status;type:integer" json:"status"`
	ErrorMessage         string     `gorm:"column:error_message;type:text;not null" json:"error_message"`
	Cost                 int64      `gorm:"column:cost;type:bigint;not null" json:"cost"`
	APIKey               string     `gorm:"column:api_key;type:character varying(255);not null" json:"api_key"`
	IPAddress            *string    `gorm:"column:ip_address;type:inet;not null;default:0.0.0.0" json:"ip_address"`
	RequestStartTime     *time.Time `gorm:"column:request_start_time;type:timestamp with time zone" json:"request_start_time"`
	ResponseCompleteTime *time.Time `gorm:"column:response_complete_time;type:timestamp with time zone" json:"response_complete_time"`
	TokensPerSecond      *float64   `gorm:"column:tokens_per_second;type:numeric(10,2)" json:"tokens_per_second"`
}

func (ModelLog) TableName() string {
	return "model_logs"
}
