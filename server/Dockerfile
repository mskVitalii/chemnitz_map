# build stage
FROM golang:1.22.3-alpine3.19 AS builder
WORKDIR /app
COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .
RUN GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o main ./cmd/main.go

# run stage
FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/app.yml .
COPY --from=builder /app/resources/datasets/ ./resources/datasets/

EXPOSE 80
CMD ["/app/main"]

#HEALTHCHECK --interval=3s --timeout=3s --start-period=1s --retries=3 \
#  CMD wget -q --spider http://localhost:80/service/healthcheck || exit 1