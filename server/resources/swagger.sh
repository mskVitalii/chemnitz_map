#!/usr/bin/env sh
export PATH=$(go env GOPATH)/bin:$PATH

swag fmt && swag init -g ./cmd/main.go -o ./docs
