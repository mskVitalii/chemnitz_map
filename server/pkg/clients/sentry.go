package clients

import (
	"dwt/internal/controller/http/v1/routes"
	"dwt/pkg/telemetry"
	"github.com/getsentry/sentry-go"
	"go.uber.org/zap"
	"strings"
)

func SetupSentry(dsn string, enableTracing bool, tracesSampleRate float64) {
	if err := sentry.Init(sentry.ClientOptions{
		Dsn:           dsn,
		EnableTracing: enableTracing,
		// Set TracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production,
		TracesSampleRate: tracesSampleRate,
		BeforeSendTransaction: func(event *sentry.Event, hint *sentry.EventHint) *sentry.Event {
			if strings.Contains(event.Request.URL, routes.HealthCheck) ||
				strings.Contains(event.Request.URL, telemetry.MetricsRoute) {
				return nil
			}
			return event
		},
		//BeforeSend: func(event *sentry.Event, hint *sentry.EventHint) *sentry.Event {
		//	log.Println("Send request to Sentry")
		//	if hint.Context != nil {
		//		if _, ok := hint.Context.Value(sentry.RequestContextKey).(*http.Request); ok {
		//			// You have access to the original Request here
		//
		//		}
		//	}
		//
		//	return event
		//},
	}); err != nil {
		telemetry.Log.Error("[SetupSentry] Sentry initialization failed", zap.Error(err))
	}
}
