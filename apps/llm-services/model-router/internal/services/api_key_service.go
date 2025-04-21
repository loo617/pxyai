package services

import (
	"pxyai/llm-services/model-router/internal/model"

	"gorm.io/gorm"
)

// ApiKeyService 定义API Key服务的接口
type ApiKeyService interface {
	GetApiKeyByKey(key string) (model.ApiKey, error)
}

type apiKeyServiceImpl struct {
	db *gorm.DB
}

func NewApiKeyService(db *gorm.DB) ApiKeyService {
	return &apiKeyServiceImpl{db: db}
}

func (s *apiKeyServiceImpl) GetApiKeyByKey(key string) (model.ApiKey, error) {
	var apiKey model.ApiKey
	if err := s.db.Where("key = ?", key).First(&apiKey).Error; err != nil {
		return apiKey, err
	}
	return apiKey, nil
}
