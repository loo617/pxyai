package providers

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"pxyai/llm-services/model-router/internal/schema"
	"pxyai/llm-services/model-router/internal/schema/deepseek"
	"pxyai/llm-services/model-router/internal/schema/openrouter"

	"github.com/gofiber/fiber/v2/log"
)

type OpenRouterClient struct {
	apiURL     string
	apiKey     string
	modelCode  string
	httpClient *http.Client
}

func NewOpenRouterClient(apiURL, apiKey, modelCode string) (*OpenRouterClient, error) {
	return &OpenRouterClient{
		apiURL:     apiURL,
		apiKey:     apiKey,
		modelCode:  modelCode,
		httpClient: &http.Client{},
	}, nil
}

func (c *OpenRouterClient) Chat(ctx context.Context, req schema.ChatRequest) (schema.ChatResponse, error) {

	openRouterReq := openrouter.ChatCompletionRequest{
		Model:    c.modelCode,
		Messages: []openrouter.Message{{Role: req.Messages[0].Role, Content: req.Messages[0].Content}},
		Stream:   false,
	}

	// 将结构体转为 JSON
	jsonData, err := json.Marshal(openRouterReq)
	if err != nil {
		panic(err)
	}

	clientReq, _ := http.NewRequest("POST", c.apiURL+"/chat/completions", bytes.NewBuffer(jsonData))
	clientReq.Header.Set("Authorization", "Bearer "+c.apiKey)
	clientReq.Header.Set("Content-Type", "application/json")

	// 发出请求
	resp, err := c.httpClient.Do(clientReq)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	//读取响应
	var openRouterRsp openrouter.ChatCompletionResponse
	if err := json.NewDecoder(resp.Body).Decode(&openRouterRsp); err != nil {
		panic(err)
	}

	log.Info("openrouter rsp: ", openRouterRsp)
	result := schema.ChatResponse{
		ID:     openRouterRsp.ID,
		Object: openRouterRsp.Object,
		// ...
		Choices: []schema.ChatChoice{
			{
				Index: openRouterRsp.Choices[0].Index,
				Message: schema.ChatMessage{
					Role:    openRouterRsp.Choices[0].Message.Role,
					Content: openRouterRsp.Choices[0].Message.Content,
				},
			},
		},
	}

	return result, nil
}

func (dc *OpenRouterClient) StreamChat(ctx context.Context, req schema.ChatRequest, writer io.Writer) (*schema.StreamResult, error) {
	deepSeekReq := deepseek.ChatCompletionRequest{
		Model:   dc.modelCode,
		Message: deepseek.Message{Role: req.Messages[0].Role, Content: req.Messages[0].Content},
		Stream:  true, // 设置为 true 来启动流式响应
	}

	// 将请求体转为 JSON
	jsonData, err := json.Marshal(deepSeekReq)
	if err != nil {
		return nil, err
	}

	clientReq, err := http.NewRequestWithContext(ctx, "POST", dc.apiURL+"/", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	clientReq.Header.Set("Authorization", "Bearer "+dc.apiKey)
	clientReq.Header.Set("Content-Type", "application/json")

	// 发起请求
	client := &http.Client{}
	resp, err := client.Do(clientReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// 使用 bytes.Buffer 作为唯一数据源
	var buf bytes.Buffer
	decoder := json.NewDecoder(io.TeeReader(resp.Body, &buf))

	for {
		var chunk deepseek.ChatCompletionChunk
		if err := decoder.Decode(&chunk); err != nil {
			if err == io.EOF {
				break
			}
			// 清空可能不完整的 buffer
			buf.Reset()
			return nil, err
		}

		// 直接复用 chunk 生成响应
		result := schema.ChatChunkData{
			ID:      chunk.Data.ID,
			Object:  chunk.Data.Object,
			Created: chunk.Data.Created,
			Model:   chunk.Data.Model,
			Choices: []schema.ChatChunkChoice{
				{
					Index: chunk.Data.Choices[0].Index,
					Delta: schema.ChatDeltaMessage{
						Role:    chunk.Data.Choices[0].Delta.Role,
						Content: chunk.Data.Choices[0].Delta.Content,
					},
					FinishReason: chunk.Data.Choices[0].FinishReason,
				},
			},
			Usage: &schema.ChatUsage{
				PromptTokens:     chunk.Data.Usage.PromptTokens,
				CompletionTokens: chunk.Data.Usage.CompletionTokens,
				TotalTokens:      chunk.Data.Usage.TotalTokens,
			},
		}

		data, err := json.Marshal(result)
		if err != nil {
			buf.Reset()
			return nil, err
		}
		// 写入 SSE 格式
		if _, err := fmt.Fprintf(writer, "data: %s\n\n", string(data)); err != nil {
			buf.Reset()
			return nil, err
		}
		if f, ok := writer.(http.Flusher); ok {
			f.Flush()
		}
	}

	// 返回前确认 buffer 完整性
	if buf.Len() == 0 {
		return nil, errors.New("empty response buffer")
	}
	return &schema.StreamResult{Buffer: &buf}, nil
}
