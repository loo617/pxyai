package main

import (
	"fmt"
	"pxyai/go-shared/pkg/config"
	"strconv"

	"gorm.io/driver/postgres"
	"gorm.io/gen"
	"gorm.io/gorm"
)

func main() {
	// 替换为你的数据库连接信息
	p := config.Config("DB_PORT")
	port, err := strconv.ParseUint(p, 10, 32)
	if err != nil {
		panic("failed to parse database port")
	}

	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		config.Config("DB_HOST"),
		port,
		config.Config("DB_USER"),
		config.Config("DB_PASSWORD"),
		config.Config("DB_NAME"),
	)

	db, err := gorm.Open(postgres.Open(dsn))
	if err != nil {
		panic("连接数据库失败: " + err.Error())
	}

	// 创建生成器实例
	g := gen.NewGenerator(gen.Config{
		OutPath:       "pkg/models",          // struct 生成目录
		ModelPkgPath:  "pkg/models",          // struct 引用路径
		FieldNullable: true,                 // 指针字段（避免零值冲突）
		FieldCoverable: true,                // gorm tag 自动映射
		FieldWithIndexTag: true,             // 添加 `index` tag
		FieldWithTypeTag: true,              // 添加 `type` tag
	})

	// 使用数据库连接
	g.UseDB(db)

	// 自动生成全部表（也可以指定表名）
	// g.GenerateModel("users", "posts") // 指定表
	g.GenerateAllTable() // ← 生成所有表

	// 生成基本 CRUD 查询代码
	g.Execute()
}