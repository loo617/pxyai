package providers

import (
	"context"
	"io"
	"pxyai/llm-services/model-router/internal/schema"
)

type MoonshotClient struct {
	apiURL    string
	apiKey    string
	modelCode string
}

func NewMoonshotClient(apiURL, apiKey, modelCode string) (*MoonshotClient, error) {
	return &MoonshotClient{
		apiURL:    apiURL,
		apiKey:    apiKey,
		modelCode: modelCode,
	}, nil
}

// mc MoonshotClient

func (mc *MoonshotClient) Chat(ctx context.Context, req schema.ChatRequest) (schema.ChatResponse, error) {
	panic("not implemented") // TODO: Implement
}

func (mc *MoonshotClient) StreamChat(ctx context.Context, req schema.ChatRequest, writer io.Writer) (*schema.StreamResult, error) {
	panic("not implemented") // TODO: Implement
}
