package services

import (
	"pxyai/go-shared/pkg/model"
	"sync"
	"time"

	"gorm.io/gorm"
)

type ProviderService interface {
	GetCachedProvider(code string) (ProviderModelDto, bool)
}

type ProviderModelDto struct {
	ProviderInfo model.Provider
	ModelMap     map[string]model.Model
}

type providerServiceImpl struct {
	cache     map[string]ProviderModelDto
	db        *gorm.DB
	mu        sync.RWMutex
	refreshIn time.Duration
}

func NewProviderService(db *gorm.DB) ProviderService {
	s := &providerServiceImpl{
		cache:     make(map[string]ProviderModelDto),
		db:        db,
		refreshIn: 5 * time.Minute,
	}
	go s.startAutoRefresh()
	return s
}

func (s *providerServiceImpl) startAutoRefresh() {
	ticker := time.NewTicker(s.refreshIn)
	defer ticker.Stop()
	s.refresh()
	for range ticker.C {
		s.refresh()
	}
}

func (s *providerServiceImpl) refresh() {
	newCache := make(map[string]ProviderModelDto)
	var providers []model.Provider
	if err := s.db.Find(&providers).Error; err != nil {
		return
	}
	for _, provider := range providers {
		var models []model.Model
		if err := s.db.Where("provider_code = ?", provider.ProviderCode).Find(&models).Error; err != nil {
			return
		}
		modelNewCache := make(map[string]model.Model)
		for _, model := range models {
			modelNewCache[model.Model] = model
		}
		newCache[provider.ProviderCode] = ProviderModelDto{
			ProviderInfo: provider,
			ModelMap:     modelNewCache,
		}
	}

	s.mu.Lock()
	s.cache = newCache
	s.mu.Unlock()
}

func (s *providerServiceImpl) GetCachedProvider(code string) (ProviderModelDto, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	providerDto, ok := s.cache[code]
	return providerDto, ok
}
