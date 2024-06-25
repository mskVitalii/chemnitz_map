package service

import (
	"dwt/internal/adapter/mongo"
	"dwt/internal/controller/http/v1/dto"
	"dwt/internal/controller/http/v1/routes"
	"dwt/internal/model"
	jwt2 "dwt/internal/utils/jwt"
	"dwt/pkg/lib"
	"errors"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"net/http"
)

// authService - dependent services
type authService struct {
	mongoRepo mongo.IMongoRepository
}

func NewAuthService(mongoRepo mongo.IMongoRepository) routes.IAuthService {
	return &authService{mongoRepo}
}

// RefreshTokenHandler godoc
//
//	@Summary		Refreshes the authentication token
//	@Description	Generates a new authentication token using the refresh token provided.
//	@Tags			auth
//	@Produce		json
//	@Security		BearerAuth
//	@Success		200	{object}	dto.SuccessRefreshTokenResponse	"Successful response with new token"
//	@Failure		401	{object}	dto.UnauthorizedResponse	"Unauthorized"
//	@Router			/api/v1/refresh_token [get]
func (s *authService) RefreshTokenHandler(_ *gin.Context) {
	// This method for swagger. Token refresh happens inside jwt.go
}

// LogoutHandler godoc
//
//	@Summary		Logs out a user and invalidates the JWT token
//	@Description	Invalidates the JWT token for the user by adding it to the blacklist and removes the JWT cookie.
//	@Tags			auth
//	@Produce		json
//	@Success		200		{object}	dto.SuccessLogoutResponse	"Successful logout"
//	@Failure		400		{object}	lib.ErrorResponse		"Bad Request"
//	@Router			/api/v1/logout [post]
func (s *authService) LogoutHandler(c *gin.Context) {
	if err := jwt2.AddTokenToBlackList(c); err != nil {
		lib.ResponseBadRequest(c, err, "authorization header or cookie required")
		return
	}
	jwt2.CleanUpToken(c)
	c.JSON(http.StatusOK, dto.SuccessLogoutResponse{Message: "Logged out"})
}

// LoginHandler godoc
//
//	@Summary		Authenticates a user and returns a JWT token
//	@Description	Authenticates a user with email and password, and returns a JWT token if the credentials are valid.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			request	body		dto.LoginRequest			true	"Login request body"
//	@Success		200		{object}	dto.SuccessLoginResponse	"Successful login"
//	@Failure		401		{object}	dto.UnauthorizedResponse	"Unauthorized"
//	@Router			/api/v1/login [post]
func (s *authService) LoginHandler(c *gin.Context, request dto.LoginRequest) (*model.User, error) {
	ctx := c.Request.Context()
	if lib.IsValidEmail(request.Email) == false {
		return nil, errors.New("invalid email")
	}
	if lib.IsValidPassword(request.Password) == false {
		return nil, errors.New("invalid password")
	}

	user, err := s.mongoRepo.GetUserByEmail(ctx, request.Email)
	if err != nil {
		return nil, err
	}

	if user == nil {
		return nil, errors.New("user: " + request.Email + " not found")
	}

	if user.Status == model.UserStatuses.Deleted {
		return nil, errors.New("user: " + request.Email + " is deleted")
	}

	if model.ProviderInUserProviders(model.UserProviders.Email, user.Providers) == false {
		return nil, errors.New("invalid provider")
	}

	if lib.CheckPasswordHash(request.Password, user.Password) {
		return user, nil
	} else {
		return nil, errors.New("invalid password")
	}
}

// ClaimsHandler godoc
//
//	@Summary		Retrieves user claims
//	@Description	Fetches and returns the claims of the authenticated user.
//	@Tags			auth
//	@Produce		json
//	@Security		BearerAuth
//	@Success		200	{object}	dto.GetUserClaimsResponse	"Successful response with user claims"
//	@Failure		401	{object}	dto.UnauthorizedResponse	"Unauthorized"
//	@Failure		500	{object}	dto.UnauthorizedResponse	"Internal server error"
//	@Router			/api/v1/claims [get]
func (s *authService) ClaimsHandler(c *gin.Context) {
	claims := jwt.ExtractClaims(c)
	id, ok := claims[jwt2.IdentityKey].(string)
	if !ok {
		lib.ResponseInternalServerError(c,
			errors.New("couldn't retrieve userClaims[id] after authorization"),
			"Invalid claims format")
		return
	}
	userTypeStr, ok := claims["userType"].(string)
	if !ok {
		lib.ResponseInternalServerError(c,
			errors.New("couldn't retrieve userClaims[userType] after authorization"),
			"Invalid claims format")
		return
	}
	userType := model.UserType(userTypeStr)
	if userType == "" {
		lib.ResponseInternalServerError(c,
			errors.New("couldn't retrieve userClaims[userType] after authorization by "+userTypeStr),
			"Invalid claims format")
	}
	c.JSON(http.StatusOK, dto.GetUserClaimsResponse{
		Id:       id,
		UserType: userType,
	})
}
