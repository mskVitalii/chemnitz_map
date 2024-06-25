package service

import (
	"dwt/internal/adapter/mongo"
	"dwt/internal/controller/http/v1/dto"
	"dwt/internal/controller/http/v1/routes"
	"dwt/internal/model"
	utilsJwt "dwt/internal/utils/jwt"
	"dwt/pkg/google"
	"dwt/pkg/lib"
	"encoding/json"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"net/http"
)

// authService - dependent services
type googleAuthService struct {
	mongoRepo   mongo.IMongoRepository
	google      google.Google
	jwtAuth     *jwt.GinJWTMiddleware
	frontendUrl string
}

func NewGoogleAuthService(
	mongoRepo mongo.IMongoRepository,
	google google.Google,
	jwtAuth *jwt.GinJWTMiddleware,
	frontendUrl string) routes.IGoogleAuthService {

	return &googleAuthService{mongoRepo, google, jwtAuth, frontendUrl}
}

// GoogleLoginHandler godoc
//
//	@Summary	Used by Google Auth provider
//	@Tags		auth
//	@Router		/api/v1/google/login [get]
func (s *googleAuthService) GoogleLoginHandler(c *gin.Context) {
	url := s.google.OAuthConfig.AuthCodeURL("state-string", oauth2.AccessTypeOffline)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

// GoogleAuthCallback godoc
//
//	@Summary	Used by Google Auth provider
//	@Tags		auth
//	@Router		/api/v1/google/callback [get]
func (s *googleAuthService) GoogleAuthCallback(c *gin.Context) {
	state := c.Query("state")
	if state != "state-string" {
		c.Redirect(http.StatusFound, s.frontendUrl+"/login/internal-error")
		return
	}

	ctx := c.Request.Context()
	code := c.Query("code")
	if code == "" {
		c.Redirect(http.StatusFound, s.frontendUrl+"/login/google-error")
		return
	}
	token, err := s.google.OAuthConfig.Exchange(ctx, code)
	if err != nil {
		c.Redirect(http.StatusFound, s.frontendUrl+"/login/google-error")
		return
	}

	client := s.google.OAuthConfig.Client(ctx, token)
	userInfo, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		c.Redirect(http.StatusFound, s.frontendUrl+"/login/google-error")
		return
	}
	defer userInfo.Body.Close()

	var user dto.CreateUserByGoogleProvider
	if err = json.NewDecoder(userInfo.Body).Decode(&user); err != nil {
		c.Redirect(http.StatusFound, s.frontendUrl+"/login/internal-error")
		return
	}

	// DB
	userFromDb, err := s.mongoRepo.GetUserByEmail(ctx, user.Email)
	if err != nil {
		c.Redirect(http.StatusFound, s.frontendUrl+"/login/internal-error")
		return
	}

	if userFromDb == nil {
		userFromDb = dto.NewUserFromGoogleProvider(user)
		if err := s.mongoRepo.CreateUser(ctx, *userFromDb); err != nil {
			c.Redirect(http.StatusFound, s.frontendUrl+"/login/internal-error")
			return
		}
	} else if model.ProviderInUserProviders(model.UserProviders.Google, userFromDb.Providers) == false {
		userFromDb.Providers = append(userFromDb.Providers, model.UserProviders.Google)
		if err := s.mongoRepo.UpdateUser(ctx, userFromDb.Id, *userFromDb); err != nil {
			c.Redirect(http.StatusFound, s.frontendUrl+"/login/internal-error")
			return
		}
	}

	if userFromDb.Status == model.UserStatuses.Deleted {
		c.Redirect(http.StatusFound, s.frontendUrl+"/login/user-deleted")
		return
	}

	// Token
	jwtToken, _, err := s.jwtAuth.TokenGenerator(userFromDb)
	if err != nil {
		c.Redirect(http.StatusFound, s.frontendUrl+"/login/internal-error")
		return
	}
	maxAge := int(s.jwtAuth.Timeout.Seconds())
	domain, _ := lib.GetDomainFromURL(s.frontendUrl)

	c.SetCookie(utilsJwt.AuthorizationCookie, jwtToken, maxAge, "/", domain, false, true)
	c.Redirect(http.StatusFound, s.frontendUrl)
}
