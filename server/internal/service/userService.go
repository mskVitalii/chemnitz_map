package service

import (
	"dwt/internal/adapter/mongo"
	"dwt/internal/controller/http/v1/dto"
	"dwt/internal/controller/http/v1/routes"
	"dwt/internal/model"
	"dwt/internal/utils/jwt"
	"dwt/pkg/lib"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"net/http"
	"slices"
)

// userService - dependent services
type userService struct {
	mongoRepo mongo.IMongoRepository
}

func NewUserService(mongoRepo mongo.IMongoRepository) routes.IUserService {
	return &userService{mongoRepo}
}

// CreateUser godoc
//
//	@Summary		Creates a new user
//	@Description	Creates a new user in the MongoDB database.
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			user	body		dto.CreateUserRequest	true	"User object to create"
//	@Success		201		{object}	dto.CreateUserResponse	"Successful response"
//	@Failure		400		{object}	lib.ErrorResponse		"Bad request"
//	@Failure		500		{object}	lib.ErrorResponse		"Internal server error"
//	@Router			/api/v1/user [post]
func (s *userService) CreateUser(c *gin.Context) {
	var userDto dto.CreateUserRequest
	if err := c.ShouldBindJSON(&userDto); err != nil {
		lib.ResponseBadRequest(c, err, "Failed to bind body")
		return
	}

	ctx := c.Request.Context()
	if lib.IsValidEmail(userDto.Email) == false {
		lib.ResponseBadRequest(c, errors.New("Invalid email"), "Invalid email")
		return
	}
	if lib.IsValidPassword(userDto.Password) == false {
		lib.ResponseBadRequest(c, errors.New("Invalid password"), "Invalid password")
		return
	}

	userByEmail, err := s.mongoRepo.GetUserByEmail(ctx, userDto.Email)
	if err != nil {
		lib.ResponseInternalServerError(c, err, "Failed to check user existence")
		return
	}
	// Adding provider Email & Password
	if userByEmail != nil {
		if model.ProviderInUserProviders(model.UserProviders.Email, userByEmail.Providers) {
			lib.ResponseBadRequest(c, err, "User already exists")
			return
		}
		userByEmail.Password = lib.HashPassword(userDto.Password)
		userByEmail.Providers = append(userByEmail.Providers, model.UserProviders.Email)
		if err := s.mongoRepo.UpdateUser(ctx, userByEmail.Id, *userByEmail); err != nil {
			lib.ResponseInternalServerError(c, err, "Error while adding Email Provider to existing user")
			return
		}

		c.JSON(http.StatusOK, dto.CreateUserResponse{Message: "Added Email Provider to existing User"})
		return
	}

	// Creating user
	favIds := make([]string, len(userDto.Favourites))
	for i, favourite := range userDto.Favourites {
		favIds[i] = favourite.Id
	}

	placeIds, err := s.mongoRepo.GetExistedPlacesIdsByIds(ctx, favIds)
	if err != nil {
		lib.ResponseInternalServerError(c, err, "Failed to check favourites")
		return
	}
	favPlaces := make([]model.UserFavourite, len(placeIds))
	favI := 0
	for _, favourite := range userDto.Favourites {
		if slices.Contains(placeIds, favourite.Id) {
			favPlaces[favI] = favourite
			favI++
		}
	}

	userDto.Favourites = favPlaces
	user := dto.NewUserFromRequest(userDto)

	if err := s.mongoRepo.CreateUser(ctx, user); err != nil {
		lib.ResponseInternalServerError(c, err, "Failed to create user")
		return
	}

	c.JSON(http.StatusCreated, dto.CreateUserResponse{Message: "User created"})
}

// GetUser godoc
//
//	@Summary		Retrieves a user by its ID
//	@Description	Retrieves a user from the MongoDB database by its ID.
//	@Tags			users
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id	path		string						true	"ID of the user to retrieve"
//	@Success		200	{object}	dto.GetUserResponse			"Successful response"
//	@Failure		401	{object}	dto.UnauthorizedResponse	"Unauthorized"
//	@Failure		404	{object}	lib.ErrorResponse			"User not found"
//	@Failure		500	{object}	lib.ErrorResponse			"Internal server error"
//	@Router			/api/v1/user/{id} [get]
func (s *userService) GetUser(c *gin.Context) {
	id := c.Param("id")
	userClaims, _ := c.Get(jwt.IdentityKey)
	if userClaims == nil {
		c.JSON(http.StatusUnauthorized, dto.UnauthorizedResponse{
			Message: "unauthorized",
		})
		return
	}
	userId := userClaims.(*jwt.UserClaims).Id
	if userId != id {
		c.JSON(http.StatusForbidden, dto.UnauthorizedResponse{
			Message: "Forbidden",
		})
		return
	}

	ctx := c.Request.Context()
	user, err := s.mongoRepo.GetUserByID(ctx, id)
	if err != nil {
		lib.ResponseInternalServerError(c, err, "Failed to get user")
		return
	}

	if user == nil {
		lib.ResponseNotFound(c, "User not found")
		return
	}

	if user.Status == model.UserStatuses.Deleted {
		lib.ResponseNotFound(c, "User not found")
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateUser godoc
//
//	@Summary		Updates a user by its ID
//	@Description	Updates a user in the MongoDB database by its ID.
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id		path		string						true	"ID of the user to update"
//	@Param			user	body		model.User					true	"User object with updated data"
//	@Success		200		{object}	dto.UpdateUserResponse		"Successful response"
//	@Failure		401		{object}	dto.UnauthorizedResponse	"Unauthorized"
//	@Failure		400		{object}	lib.ErrorResponse			"Bad request"
//	@Failure		500		{object}	lib.ErrorResponse			"Internal server error"
//	@Router			/api/v1/user/{id} [put]
func (s *userService) UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		lib.ResponseBadRequest(c, err, "Failed to bind body")
		return
	}

	if lib.IsValidEmail(user.Email) == false {
		lib.ResponseBadRequest(c, errors.New("Invalid email"), "Invalid email")
		return
	}

	if lib.IsValidPassword(user.Password) == false && model.ProviderInUserProviders(model.UserProviders.Email, user.Providers) {
		lib.ResponseBadRequest(c, errors.New("Invalid password"), "Invalid password")
		return
	}

	userClaims, _ := c.Get(jwt.IdentityKey)
	if userClaims == nil {
		c.JSON(http.StatusUnauthorized, dto.UnauthorizedResponse{Message: "unauthorized"})
		return
	}
	userType := userClaims.(*jwt.UserClaims).UserType
	userId := userClaims.(*jwt.UserClaims).Id
	if userType != user.UserType {
		//utils.ResponseInternalServerError(c, nil, "Not allowed to change user type (only by subscription)")
		//return
	}

	if userId != user.Id || userId != id {
		lib.ResponseBadRequest(c, errors.New("Wrong user id"), "User id must be the same user")
		return
	}
	if user.Status == model.UserStatuses.Deleted {
		lib.ResponseBadRequest(c, errors.New("Wrong method"), "Use DELETE /api/v1/user to change user status")
		return
	}

	ctx := c.Request.Context()
	userByID, err := s.mongoRepo.GetUserByID(ctx, id)
	if err != nil {
		lib.ResponseBadRequest(c, errors.New("User doesn't exist"), "Use correct id")
		return
	}

	// Changing password
	if userByID.Password != user.Password {
		user.Password = lib.HashPassword(userByID.Password)
	} else if user.Password == "" {
		user.Password = userByID.Password
	}

	favIds := make([]string, len(user.Favourites))
	for i, favourite := range user.Favourites {
		favIds[i] = favourite.Id
	}
	placeIds, err := s.mongoRepo.GetExistedPlacesIdsByIds(ctx, favIds)
	if err != nil {
		lib.ResponseInternalServerError(c, err, "Failed to check favourites")
	}
	favPlaces := make([]model.UserFavourite, len(placeIds))
	favI := 0
	for _, favourite := range user.Favourites {
		if slices.Contains(placeIds, favourite.Id) {
			favPlaces[favI] = favourite
			favI++
		}
	}
	user.Favourites = favPlaces

	if err := s.mongoRepo.UpdateUser(ctx, id, user); err != nil {
		lib.ResponseInternalServerError(c, err, "Failed to update user")
		return
	}

	c.JSON(http.StatusOK, dto.UpdateUserResponse{Message: "User updated"})
}

// DeleteUser godoc
//
//	@Summary		Deletes a user by its ID
//	@Description	Deletes a user from the MongoDB database by its ID.
//	@Tags			users
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id	path		string						true	"ID of the user to delete"
//	@Success		200	{object}	dto.DeleteUserResponse		"Successful response"
//	@Failure		401	{object}	dto.UnauthorizedResponse	"Unauthorized"
//	@Failure		500	{object}	lib.ErrorResponse			"Internal server error"
//	@Router			/api/v1/user/{id} [delete]
func (s *userService) DeleteUser(c *gin.Context) {
	id := c.Param("id")
	ctx := c.Request.Context()

	userClaims, _ := c.Get(jwt.IdentityKey)
	if userClaims == nil {
		c.JSON(http.StatusUnauthorized, dto.UnauthorizedResponse{Message: "unauthorized"})
		return
	}
	userId := userClaims.(*jwt.UserClaims).Id
	if userId != id {
		lib.ResponseBadRequest(c, errors.New("Wrong user id"), "User id must be for the same user")
		return
	}

	if err := s.mongoRepo.DeleteUser(ctx, id); err != nil {
		lib.ResponseInternalServerError(c, err, "Failed to delete user")
		return
	}

	jwt.CleanUpToken(c)
	c.JSON(http.StatusOK, dto.DeleteUserResponse{Message: "User deleted"})
}
