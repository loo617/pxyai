package schema

type ChatRequest struct {
	ProviderCode string         `json:"provider_code"`
	ModelCode    string         `json:"model_code"`
	Messages     []Message      `json:"messages"`
	Stream       bool           `json:"stream"`
	Temperature  *float64       `json:"temperature,omitempty"`
	TopP         *float64       `json:"top_p,omitempty"`
	Extra        map[string]any `json:"extra,omitempty"` // 允许接收自定义扩展参数
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}
