package middleware

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

var validate = validator.New()

// ValidateBody 是一个泛型中间件封装函数，自动解析并校验请求体
func ValidateBody[T any](handler func(c *fiber.Ctx, body T) error) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var body T
		if err := c.BodyParser(&body); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Invalid JSON: "+err.Error())
		}

		// 字段校验
		if err := validate.Struct(body); err != nil {
			validationErrors := err.(validator.ValidationErrors)
			errs := make(map[string]string)
			for _, e := range validationErrors {
				errs[e.Field()] = e.ActualTag()
			}

			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "Validation failed",
				"errors":  errs,
			})
		}

		// 继续执行原处理逻辑
		return handler(c, body)
	}
}
