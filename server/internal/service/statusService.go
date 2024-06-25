package service

import (
	"dwt/internal/controller/http/v1/routes"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

// statusService - dependent services
type statusService struct {
}

func NewStatusService() routes.IStatusService {
	return &statusService{}
}

// HealthCheck godoc
//
//	@Summary		Perform health check
//	@Description	Check if the service is healthy
//	@Tags			service
//	@Produce		json
//	@Success		200
//	@Router			/api/v1/healthcheck [get]
func (s statusService) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message":   "OK",
		"timestamp": time.Now().UnixNano() / int64(time.Millisecond),
	})
}

// Metrics godoc
//
//	@Summary		Prometheus logs
//	@Description	Logs that are collected by prometheus and visualized in grafana
//	@Tags			service
//	@Success		200
//	@Router			/metrics [get]
func (s statusService) Metrics(_ *gin.Context) {
	// already implemented. Func is used to generate swagger
}
