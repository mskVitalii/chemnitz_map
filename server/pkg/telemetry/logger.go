package telemetry

import (
	"context"
	"dwt/internal/utils/config"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/grafana/loki-client-go/loki"
	"github.com/prometheus/common/model"
	"go.opentelemetry.io/otel/trace"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"time"
)

var Log *zap.Logger

type LokiWriter struct {
	client *loki.Client
}

func (lw *LokiWriter) Write(p []byte) (n int, err error) {
	timestamp := time.Now()
	message := string(p)
	labels := model.LabelSet{
		"job": "chemnitz-map",
	}

	fmt.Print(message)
	if err := lw.client.Handle(labels, timestamp, message); err != nil {
		return 0, err
	}

	return len(p), nil
}

func SetupLogger(cfg *config.Config) {
	lokiCfg, err := loki.NewDefaultConfig(cfg.LokiURL)
	if err != nil {
		panic(err)
	}

	lokiClient, err := loki.New(lokiCfg)
	if err != nil {
		panic(err)
	}

	lw := &LokiWriter{client: lokiClient}

	encoderConfig := zapcore.EncoderConfig{
		MessageKey:  "message",
		LevelKey:    "level",
		TimeKey:     "ts",
		EncodeTime:  zapcore.ISO8601TimeEncoder,
		EncodeLevel: zapcore.CapitalLevelEncoder,
	}

	var encoder zapcore.Encoder
	if cfg.IsDebug == true && cfg.LocalJsonLog == false {
		encoder = zapcore.NewConsoleEncoder(encoderConfig)
	} else {
		encoder = zapcore.NewJSONEncoder(encoderConfig)
	}

	core := zapcore.NewCore(
		encoder,
		zapcore.AddSync(lw),
		zap.DebugLevel,
	)

	Log = zap.New(core)
}

func LoggerMiddleware(logger *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Start timer
		startTime := time.Now()

		// Process request
		c.Next()

		// End timer
		endTime := time.Now()
		latency := endTime.Sub(startTime)

		// Get request details
		method := c.Request.Method
		path := c.Request.URL.Path
		statusCode := c.Writer.Status()
		clientIP := c.ClientIP()

		// Get trace from context
		traceID := "No trace ID"
		span := trace.SpanFromContext(c.Request.Context())
		if span.SpanContext().IsValid() {
			traceID = span.SpanContext().TraceID().String()
		}

		// Log the request details
		logger.Info("incoming request",
			zap.String("clientIP", clientIP),
			zap.String("time", endTime.Format(time.RFC1123)),
			zap.String("method", method),
			zap.String("path", path),
			zap.Int("status", statusCode),
			zap.Duration("latency", latency),
			zap.String("traceID", traceID),
		)
	}
}

func TraceForZapLog(ctx context.Context) zap.Field {
	traceID := "No trace ID"
	span := trace.SpanFromContext(ctx)
	if span.SpanContext().IsValid() {
		traceID = span.SpanContext().TraceID().String()
	}
	return zap.String("traceID", traceID)
}
