package dto

import (
	"dwt/internal/model"
	"dwt/pkg/lib"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DeleteUserResponse struct {
	Message string `json:"message"`
}

type UpdateUserResponse struct {
	Message string `json:"message"`
}

type CreateUserResponse struct {
	Message string `json:"message"`
}

type GetUserResponse model.User

type CreateUserRequest struct {
	Email      string                `json:"email"`
	Password   string                `json:"password"`
	Favourites []model.UserFavourite `json:"favourites"`
	Homes      []model.UserHome      `json:"homes"`
	UserType   model.UserType        `json:"userType"`
	Status     model.Status          `json:"status"`
}

type CreateUserByGoogleProvider struct {
	Email string `json:"email"`
}

func NewUserFromRequest(req CreateUserRequest) model.User {
	return model.User{
		Id:         primitive.NewObjectID().Hex(),
		Email:      req.Email,
		Password:   lib.HashPassword(req.Password),
		Providers:  []model.UserProvider{model.UserProviders.Email},
		Favourites: req.Favourites,
		Homes:      req.Homes,
		UserType:   req.UserType,
		Status:     req.Status,
	}
}

func NewUserFromGoogleProvider(user CreateUserByGoogleProvider) *model.User {
	return &model.User{
		Id:         primitive.NewObjectID().Hex(),
		Email:      user.Email,
		Password:   "",
		Providers:  []model.UserProvider{model.UserProviders.Google},
		Favourites: []model.UserFavourite{},
		Homes:      []model.UserHome{},
		UserType:   model.UserTypes.Regular,
		Status:     model.UserStatuses.Active,
	}
}
