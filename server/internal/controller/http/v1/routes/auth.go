package routes

import (
	"dwt/internal/controller/http/v1/dto"
	"dwt/internal/model"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

const (
	login          = "/login"
	logout         = "/logout"
	refreshToken   = "/refresh_token"
	googleLogin    = "/google/login"
	GoogleCallback = "/google/callback"
	claims         = "/claims"
)

type IAuthService interface {
	LoginHandler(c *gin.Context, request dto.LoginRequest) (*model.User, error)
	LogoutHandler(c *gin.Context)
	RefreshTokenHandler(c *gin.Context)
	ClaimsHandler(c *gin.Context)
}

type IGoogleAuthService interface {
	GoogleLoginHandler(c *gin.Context)
	GoogleAuthCallback(c *gin.Context)
}

func RegisterAuthRoutes(g *gin.RouterGroup,
	authService IAuthService,
	googleService IGoogleAuthService,
	sec *jwt.GinJWTMiddleware) {

	g.POST(login, func(c *gin.Context) {
		c.Set("authMiddleware", sec)
		sec.LoginHandler(c)
	})
	g.POST(logout, sec.MiddlewareFunc(), authService.LogoutHandler)
	g.GET(refreshToken, sec.MiddlewareFunc(), sec.RefreshHandler)
	g.GET(googleLogin, googleService.GoogleLoginHandler)
	g.GET(GoogleCallback, googleService.GoogleAuthCallback)
	g.GET(claims, sec.MiddlewareFunc(), authService.ClaimsHandler)
}
