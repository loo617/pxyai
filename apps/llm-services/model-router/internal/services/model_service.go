package services

import (
	"pxyai/go-shared/pkg/model"

	"gorm.io/gorm"
)

type ModelService interface {
	GetModel(providerCode string, modelCode string) (*model.Model, error)
}

type modelServiceImpl struct {
	db *gorm.DB
}

func NewModelService(db *gorm.DB) ModelService {
	return &modelServiceImpl{db: db}
}

func (m *modelServiceImpl) GetModel(providerCode string, modelCode string) (*model.Model, error) {
	var model model.Model
	if err := m.db.Where("provider_code = ? AND model = ?", providerCode, modelCode).First(&model).Error; err != nil {
		return nil, err
	}
	return &model, nil
}
