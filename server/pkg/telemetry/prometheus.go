package telemetry

import (
	"github.com/gin-gonic/gin"
	"github.com/penglongli/gin-metrics/ginmetrics"
	"go.uber.org/zap"
)

const MetricsRoute = "/metrics"

func SetupPrometheus(r *gin.Engine, slowTime int32) {
	m := ginmetrics.GetMonitor()
	m.SetMetricPath(MetricsRoute)
	// +optional set slow time, default 5s
	m.SetSlowTime(slowTime)
	// +optional set request duration, default {0.1, 0.3, 1.2, 5, 10}
	// used to p95, p99
	m.SetDuration([]float64{0.1, 0.3, 1.2, 5, 10})

	m.Use(r)
}

func AddMetric(metric *ginmetrics.Metric) {
	if err := ginmetrics.GetMonitor().AddMetric(metric); err != nil {
		Log.Error("[AddMetric] Failed to register metric", zap.Error(err))
	}
}
