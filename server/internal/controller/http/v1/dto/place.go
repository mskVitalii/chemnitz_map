package dto

import "dwt/internal/model"

type SearchPlacesRequest struct {
	Categories    []string          `json:"categories,omitempty"`
	IsBarrierFree bool              `json:"isBarrierFree,omitempty,string"`
	HasEmail      bool              `json:"hasEmail,omitempty,string"`
	Other         map[string]string `json:"other,omitempty,string"`
}

type SearchPlacesResponse struct {
	Data    []model.PlaceMinified `json:"data"`
	Message string                `json:"message"`
}

type ReadPlacesResponse struct {
	Data    *model.Place `json:"data"`
	Message string       `json:"message"`
}
