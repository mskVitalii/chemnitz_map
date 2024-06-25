package routes

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

const (
	userCRUD = "/user"
)

type IUserService interface {
	CreateUser(c *gin.Context)
	GetUser(c *gin.Context)
	UpdateUser(c *gin.Context)
	DeleteUser(c *gin.Context)
}

func RegisterUserRoutes(g *gin.RouterGroup, userService IUserService, securityHandler *jwt.GinJWTMiddleware) {
	g.POST(userCRUD, userService.CreateUser)
	g.GET(userCRUD+"/:id", securityHandler.MiddlewareFunc(), userService.GetUser)
	g.PUT(userCRUD+"/:id", securityHandler.MiddlewareFunc(), userService.UpdateUser)
	g.DELETE(userCRUD+"/:id", securityHandler.MiddlewareFunc(), userService.DeleteUser)
}
