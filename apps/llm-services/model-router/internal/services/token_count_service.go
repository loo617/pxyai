package services

type TokenCountService interface {
	CalculateTokenCount(text string, model string) (int, error)
}
