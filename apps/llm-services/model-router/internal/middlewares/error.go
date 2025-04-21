package middlewares

import "github.com/gofiber/fiber/v2"

func ErrorMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		err := c.Next()
		if err != nil {
			code := fiber.StatusInternalServerError
			msg := "Internal Server Error"

			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
				msg = e.Message
			}

			return c.Status(code).JSON(fiber.Map{
				"error": msg,
			})
		}
		return nil
	}
}
