package lib

import (
	"github.com/getsentry/sentry-go"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

type ErrorResponse struct {
	Message string `json:"message"`
}

func ResponseBadRequest(c *gin.Context, err error, message string) {
	sentry.CaptureException(err)
	sentry.Flush(time.Second * 5)
	c.JSON(http.StatusBadRequest, ErrorResponse{Message: message})
}

func ResponseInternalServerError(c *gin.Context, err error, message string) {
	sentry.CaptureException(err)
	sentry.Flush(time.Second * 5)
	c.JSON(http.StatusInternalServerError, ErrorResponse{Message: message})
}

func ResponseNotFound(c *gin.Context, message string) {
	c.JSON(http.StatusNotFound, ErrorResponse{Message: message})
}
