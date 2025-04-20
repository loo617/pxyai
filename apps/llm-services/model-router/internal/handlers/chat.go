package handlers

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"pxyai/llm-services/model-router/internal/providers"
	"pxyai/llm-services/model-router/internal/schema"
	"pxyai/llm-services/model-router/internal/services"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/valyala/fasthttp"
)

type ChatHandler struct {
	apiKeyService   services.ApiKeyService
	modelService    services.ModelService
	providerService services.ProviderService
	client          providers.ProviderClient
}

func NewChatHandler(apiKeyService services.ApiKeyService,
	modelService services.ModelService,
	providerService services.ProviderService) *ChatHandler {
	return &ChatHandler{
		apiKeyService:   apiKeyService,
		modelService:    modelService,
		providerService: providerService,
		client:          nil,
	}
}

// 对话
func (h *ChatHandler) Chat(c *fiber.Ctx) error {
	stdCtx, cancel := context.WithTimeout(c.Context(), 30*time.Second)
	defer cancel()

	//从header取出apiKey
	authHeader := c.Get("Authorization")
	parts := strings.SplitN(authHeader, "Bearer ", 2)
	if len(parts) != 2 {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "invalid authorization header format",
		})
	}
	apiKey := parts[1]

	// 验证 API Key 是否可用
	if _, err := h.apiKeyService.CheckApiKeyAvailable(apiKey); err != nil {
		return err
	}

	var chatRequest schema.ChatRequest
	if err := c.BodyParser(&chatRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "cannot parse JSON",
		})
	}

	// 1. 获取服务商code
	providerDto, ok := h.providerService.GetCachedProvider(chatRequest.ProviderCode)
	if !ok {
		return errors.New("provider is disabled")
	}
	if providerDto.ProviderInfo.Status != 1 {
		return errors.New("provider is disabled")
	}

	// 2. 获取模型code
	if providerDto.ModelMap == nil {
		return errors.New("no avaliabled models")
	}

	model, ok := providerDto.ModelMap[chatRequest.ModelCode]
	if !ok || model.Status != 1 {
		return errors.New("model is disabled")
	}

	c.Set("model", model.Model)
	// 3. 获取或创建服务商客户端
	providerInfo := providerDto.ProviderInfo
	pc, err := providers.NewProviderClient(providerInfo.APIURL, providerInfo.APIKey, chatRequest.ModelCode, chatRequest.ProviderCode)
	if err != nil {
		return err
	}
	h.client = pc

	// 4. 调用服务商Chat api
	if chatRequest.Stream {
		c.Set("Content-Type", "text/event-stream")
		c.Set("Cache-Control", "no-cache")
		c.Set("Connection", "keep-alive")

		c.Context().SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {
			result, err := h.client.StreamChat(stdCtx, chatRequest, w)
			if err != nil {
				return
			}
			w.Flush()

			// 可选：异步分析 token 使用、日志记录等
			go func() {
				if result != nil && result.Buffer != nil {
					// 例如：记录 token 数量、日志、埋点等
					// analyzeStream(result.Buffer.Bytes())
				}
			}()
		}))
		return nil
	} else {
		//非流式
		resp, err := h.client.Chat(stdCtx, chatRequest)
		if err != nil {
			return err
		}
		data, err := json.Marshal(resp)
		if err != nil {
			return err
		}
		return c.Type("json").Send(data)
	}
}
