APP_NAME := pxyai
BUILD_DIR := ./bin
BUILD_TARGET := $(BUILD_DIR)/$(APP_NAME)
MAIN_PACKAGE := ./cmd

# GOOS ?= $(shell go env GOOS)
# GOARCH ?= $(shell go env GOARCH)

GOOS ?= linux
GOARCH ?= amd64
CGO_ENABLED ?= 0
LD_FLAGS := -s -w
BUILD_TIME := $(shell date -u '+%Y-%m-%dT%H:%M:%SZ')

.PHONY: all build clean

all: build

build:
	@echo "🔧 Building $(APP_NAME)..."
	@mkdir -p $(BUILD_DIR)
	GOOS=$(GOOS) GOARCH=$(GOARCH) CGO_ENABLED=$(CGO_ENABLED) \
	go build -trimpath -ldflags="$(LD_FLAGS)" -o $(BUILD_TARGET) $(MAIN_PACKAGE)
	@echo "✅ Build complete: $(BUILD_TARGET)"

clean:
	@echo "🧹 Cleaning up..."
	rm -rf $(BUILD_DIR)