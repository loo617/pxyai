package zhipu

type ChatCompletionRequest struct {
	Model   string  `json:"model"`
	Message Message `json:"message"`
	Stream  bool    `json:"stream"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}
