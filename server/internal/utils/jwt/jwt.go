package jwt

import (
	"dwt/internal/controller/http/v1/dto"
	"dwt/internal/controller/http/v1/routes"
	"dwt/internal/model"
	"dwt/internal/utils/config"
	"dwt/pkg/lib"
	"dwt/pkg/telemetry"
	"errors"
	"fmt"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"net/http"
	"time"
)

const IdentityKey = "id"
const AuthorizationHeader = "Authorization"
const AuthorizationCookie = "jwt-token"
const Timeout = time.Hour * 24

// Startup - returns protected router group
func Startup(cfg *config.Config, service routes.IAuthService) *jwt.GinJWTMiddleware {

	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Realm:           "Chemnitz map",
		Key:             []byte(cfg.SecretKeyJWT),
		Timeout:         Timeout,
		MaxRefresh:      time.Hour * 24 * 7,
		IdentityKey:     IdentityKey,
		IdentityHandler: identityHandler,
		Authenticator:   authenticator(service),
		Authorizator:    authorization,
		Unauthorized:    unauthorized,
		PayloadFunc:     payloadFunc,
		LoginResponse:   loginResponse,
		RefreshResponse: refreshResponse,
		// TokenLookup is a string in the form of "<source>:<name>" that is used
		// to extract token from the request.
		// Optional. Default value "header:Authorization".
		// Possible values:
		// - "header:<name>"
		// - "query:<name>"
		// - "cookie:<name>"
		// - "param:<name>"
		TokenLookup: fmt.Sprintf("header:%s,cookie:%s", AuthorizationHeader, AuthorizationCookie),
		// TokenLookup: "query:token",
		// TokenLookup: "cookie:token",

		// TokenHeadName is a string in the header. Default value is "Bearer"
		TokenHeadName: "Bearer",

		// TimeFunc provides the current time. You can override it to use another time value. This is useful for testing or if your server uses a different time zone than your tokens.
		TimeFunc: time.Now,
	})

	if err != nil {
		telemetry.Log.Fatal("JWT Error", zap.Error(err))
	}

	// When you use jwt.New(), the function is already automatically called for checking,
	// which means you don't need to call it again.
	if err := authMiddleware.MiddlewareInit(); err != nil {
		telemetry.Log.Fatal("authMiddleware.MiddlewareInit", zap.Error(err))
	}

	return authMiddleware
}

// authenticator runs request to DB to check credentials
func authenticator(service routes.IAuthService) func(c *gin.Context) (interface{}, error) {
	return func(c *gin.Context) (interface{}, error) {
		var loginVals dto.LoginRequest
		if err := c.ShouldBind(&loginVals); err != nil {
			return "", errors.New("missing email or password")
		}
		if lib.IsValidEmail(loginVals.Email) == false {
			return "", errors.New("invalid email")
		}
		return service.LoginHandler(c, loginVals)
	}
}

// payloadFunc adds additional payload
func payloadFunc(data interface{}) jwt.MapClaims {
	if v, ok := data.(*model.User); ok {
		return jwt.MapClaims{
			"id":       v.Id,
			"userType": v.UserType,
		}
	}
	return jwt.MapClaims{}
}

type UserClaims struct {
	Id       string         `json:"id"`
	UserType model.UserType `json:"userType"`
}

// identityHandler happens before authorization
func identityHandler(c *gin.Context) interface{} {
	claims := jwt.ExtractClaims(c)
	return &UserClaims{
		Id:       claims[IdentityKey].(string),
		UserType: model.UserType(claims["userType"].(string)),
	}
}

// blacklistedTokens here should be Redis
var blacklistedTokens = make(map[string]bool)

// AddTokenToBlackList block token for logout
func AddTokenToBlackList(c *gin.Context) error {
	token := c.GetHeader(AuthorizationHeader)
	if token == "" {
		cookie, err := c.Cookie(AuthorizationCookie)
		if err != nil {
			return err
		}
		token = cookie
	}
	blacklistedTokens[token] = true
	return nil
}

// authorization last step
func authorization(data interface{}, c *gin.Context) bool {
	token := c.GetHeader(AuthorizationHeader)
	if token == "" {
		cookie, err := c.Cookie(AuthorizationCookie)
		if err != nil {
			return false
		}
		token = cookie
	}

	if _, found := blacklistedTokens[token]; found {
		return false
	}

	_, ok := data.(*UserClaims)
	return ok
}

// unauthorized function response no token
func unauthorized(c *gin.Context, code int, message string) {
	c.JSON(code, dto.UnauthorizedResponse{Message: message})
}

func NoRoute(c *gin.Context) {
	claims := jwt.ExtractClaims(c)
	telemetry.Log.Info(fmt.Sprintf("NoRoute claims: %v", claims), telemetry.TraceForZapLog(c.Request.Context()))
	c.JSON(http.StatusNotFound, gin.H{"message": "Page not found"})
}

func CleanUpToken(c *gin.Context) {
	c.SetCookie(AuthorizationCookie, "", -1, "/", "", false, true)
}

func loginResponse(c *gin.Context, _ int, message string, time time.Time) {
	maxAge := int(Timeout.Seconds())
	expire := time.Add(Timeout)
	domain := c.Request.Host
	c.SetCookie(AuthorizationCookie, message, maxAge, "/", domain, false, true)
	c.JSON(http.StatusOK, dto.SuccessLoginResponse{
		Message: "Login successful",
		Expire:  expire,
	})
}

func refreshResponse(c *gin.Context, _ int, message string, time time.Time) {
	maxAge := int(Timeout.Seconds())
	expire := time.Add(Timeout)
	domain := c.Request.Host
	c.SetCookie(AuthorizationCookie, message, maxAge, "/", domain, false, true)
	c.JSON(http.StatusOK, dto.SuccessRefreshTokenResponse{
		Message: "Token refreshed successfully",
		Expire:  expire,
	})
}
