package schema

import "bytes"

type ChatResponse struct {
	ID      string       `json:"id"`
	Object  string       `json:"object"`
	Created int64        `json:"created"`
	Model   string       `json:"model"`
	Choices []ChatChoice `json:"choices"`
	Usage   *ChatUsage   `json:"usage,omitempty"`
}

type ChatChoice struct {
	Index        int         `json:"index"`
	FinishReason string      `json:"finish_reason"`
	Message      ChatMessage `json:"message"`
}

type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatUsage struct {
	PromptTokens     int `json:"prompt_tokens"`
	CompletionTokens int `json:"completion_tokens"`
	TotalTokens      int `json:"total_tokens"`
}

type StreamResult struct {
	Buffer *bytes.Buffer // 原始副本（日志、计费、token 分析用）
	//Tokens *TokenUsageEstimate   // 可选：提前计算的 token 数量
	TraceID string // 可选：链路追踪用
	// 还可以扩展其他字段：Latency, ModelVersion, FinishReason 等
}

type ChatChunk struct {
	Data ChatChunkData `json:"data"`
}

type ChatChunkData struct {
	ID      string            `json:"id"`
	Object  string            `json:"object"`
	Created int64             `json:"created"`
	Model   string            `json:"model"`
	Choices []ChatChunkChoice `json:"choices"`
	Usage   *ChatUsage        `json:"usage,omitempty"`
}

type ChatChunkChoice struct {
	Index        int              `json:"index"`
	Delta        ChatDeltaMessage `json:"delta"`
	FinishReason *string          `json:"finish_reason"` // 可能为 null
}

type ChatDeltaMessage struct {
	Role    string `json:"role,omitempty"`
	Content string `json:"content,omitempty"`
}
