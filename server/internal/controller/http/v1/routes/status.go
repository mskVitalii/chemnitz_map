package routes

import (
	"github.com/gin-gonic/gin"
)

const (
	HealthCheck = "/healthcheck"
)

type IStatusService interface {
	HealthCheck(c *gin.Context)
	Metrics(c *gin.Context)
}

func RegisterStatusRoutes(g *gin.RouterGroup, service IStatusService) {
	g.GET(HealthCheck, service.HealthCheck)
}
