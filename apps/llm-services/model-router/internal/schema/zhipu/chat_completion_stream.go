package zhipu

type ChatCompletionChunk struct {
	Data ChatCompletionData `json:"data"` // 解析最外层的 data
}

type ChatCompletionData struct {
	ID                string            `json:"id"`
	Object            string            `json:"object"`
	Created           int64             `json:"created"`
	Model             string            `json:"model"`
	SystemFingerprint string            `json:"system_fingerprint"`
	Choices           []ChatChunkChoice `json:"choices"`
	Usage             *ChatUsage        `json:"usage,omitempty"`
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
