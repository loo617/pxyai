package utils

import (
	"encoding/json"
	"fmt"
)

// StructToJSON 将结构体编码为 JSON 字符串（用于日志输出）
func StructToJSON(v any) string {
	data, err := json.Marshal(v)
	if err != nil {
		return fmt.Sprintf("<json error: %v>", err)
	}
	return string(data)
}

// StructToPrettyJSON 输出格式化 JSON 字符串（便于开发调试）
func StructToPrettyJSON(v any) string {
	data, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return fmt.Sprintf("<json error: %v>", err)
	}
	return string(data)
}

// DumpStruct 直接将结构体打印为 %+v 格式（适合本地调试日志）
func DumpStruct(v any) string {
	return fmt.Sprintf("%+v", v)
}
