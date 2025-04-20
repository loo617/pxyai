package services

type BillingService interface {
	RecordTokenUsage(openUserID string, model string, inputTokens int, outputTokens int) error
	CheckUserBalance(openUserID string) (bool, error)
}
