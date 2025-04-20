package validator

import (
	"reflect"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
    validate = validator.New()
    
    // 注册自定义验证函数
    //validate.RegisterValidation("custom_rule", validateCustomRule)
    
    // 注册结构体字段名称映射函数，用于错误输出
    validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
        name := fld.Tag.Get("json")
        if name == "" {
            return fld.Name
        }
        return name
    })
}

// Validate 验证结构体
func Validate(s interface{}) error {
    return validate.Struct(s)
}

// ValidateVar 验证单个变量
func ValidateVar(field interface{}, tag string) error {
    return validate.Var(field, tag)
}

// 更多实用验证函数...