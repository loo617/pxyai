package providers

import (
	"context"
	"errors"
	"io"

	"pxyai/llm-services/model-router/internal/schema"
)

type ProviderClient interface {
	Chat(ctx context.Context, req schema.ChatRequest) (schema.ChatResponse, error)
	StreamChat(ctx context.Context, req schema.ChatRequest, writer io.Writer) (*schema.StreamResult, error)
}

// 客户端工厂方法
func NewProviderClient(apiURL, apiKey, modelCode, providerCode string) (ProviderClient, error) {
	switch providerCode {
	case "deepseek":
		return NewDeepSeekClient(apiURL, apiKey, modelCode)
	case "moonshot":
		return NewMoonshotClient(apiURL, apiKey, modelCode)
	case "openrouter":
		return NewOpenRouterClient(apiURL, apiKey, modelCode)
	default:
		return nil, errors.New("unsupported provider")
	}
}
