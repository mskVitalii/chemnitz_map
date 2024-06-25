package dto

import (
	"dwt/internal/model"
	"time"
)

type LoginRequest struct {
	Email    string `form:"email" json:"email" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

type SuccessLoginResponse struct {
	Message string    `json:"message"`
	Expire  time.Time `json:"expire"`
}

type UnauthorizedResponse struct {
	Message string `json:"message"`
}

type SuccessRefreshTokenResponse struct {
	Message string    `json:"message"`
	Expire  time.Time `json:"expire"`
}

type GetUserClaimsResponse struct {
	Id       string         `json:"id"`
	UserType model.UserType `json:"userType"`
}

type SuccessLogoutResponse struct {
	Message string `json:"message"`
}

type BadRequestResponse struct {
	Error string `json:"error"`
}
