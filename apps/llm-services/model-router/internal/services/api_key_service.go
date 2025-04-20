package services

import (
	"errors"
	"pxyai/go-shared/pkg/model"

	"gorm.io/gorm"
)

// ApiKeyService 定义API Key服务的接口
type ApiKeyService interface {
	CheckApiKeyAvailable(key string) (bool, error)
}

type apiKeyServiceImpl struct {
	db *gorm.DB
}

func NewApiKeyService(db *gorm.DB) ApiKeyService {
	return &apiKeyServiceImpl{db: db}
}

func (s *apiKeyServiceImpl) CheckApiKeyAvailable(key string) (bool, error) {
	var apiKey model.ApiKey
	if err := s.db.Where("key = ?", key).First(&apiKey).Error; err != nil {
		return false, errors.New(err.Error())
	}
	if apiKey.ExpiresAt != nil && apiKey.ExpiresAt.Before(s.db.NowFunc()) {
		return false, errors.New("API key has expired")
	}
	return true, nil
}
