package telemetry

import (
	"context"
	"dwt/internal/utils/config"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/jaeger"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/semconv/v1.4.0"
	"go.opentelemetry.io/otel/trace"
)

func SetupOTelSDK(ctx context.Context, cfg *config.Config) (shutdown func(context.Context) error, err error) {
	var shutdownFunctions []func(context.Context) error
	shutdown = func(ctx context.Context) error {
		var err error
		for _, fn := range shutdownFunctions {
			err = errors.Join(err, fn(ctx))
		}
		shutdownFunctions = nil
		return err
	}

	handleErr := func(inErr error) {
		err = errors.Join(inErr, shutdown(ctx))
	}

	// Set up propagator.
	prop := newPropagator()
	otel.SetTextMapPropagator(prop)

	// Set up trace provider.
	traceProvider, err := newTraceProvider(
		cfg.Service,
		cfg.Jaeger.Host,
		cfg.Jaeger.Port)
	if err != nil {
		handleErr(err)
		return
	}
	shutdownFunctions = append(shutdownFunctions, traceProvider.Shutdown)
	otel.SetTracerProvider(traceProvider)
	return
}

func newTraceProvider(service, host string, port int) (*sdktrace.TracerProvider, error) {
	url := fmt.Sprintf("http://%s:%d/api/traces", host, port)

	traceExporter, err := jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint(url)))
	if err != nil {
		return nil, err
	}

	resourceWithAttrs := resource.NewWithAttributes(
		semconv.SchemaURL,
		semconv.ServiceNameKey.String(service),
	)

	traceProvider := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(traceExporter),
		sdktrace.WithResource(resourceWithAttrs),
	)
	return traceProvider, nil
}

func newPropagator() propagation.TextMapPropagator {
	return propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	)
}

const TraceHeader = "X-Trace-ID"

// TraceIDMiddleware adds the trace ID to the response headers.
func TraceIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		span := trace.SpanFromContext(c.Request.Context())
		if span.SpanContext().IsValid() {
			traceID := span.SpanContext().TraceID().String()
			c.Header(TraceHeader, traceID)
		}

		c.Next()
	}
}
