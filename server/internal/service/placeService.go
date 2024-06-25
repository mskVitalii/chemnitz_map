package service

import (
	"dwt/internal/adapter/mongo"
	"dwt/internal/controller/http/v1/dto"
	"dwt/internal/controller/http/v1/routes"
	"dwt/pkg/lib"
	"github.com/gin-gonic/gin"
	"net/http"
)

// placeService - dependent services
type placeService struct {
	mongoRepo mongo.IMongoRepository
}

func NewPlaceService(mongoRepo mongo.IMongoRepository) routes.IPlaceService {
	return &placeService{mongoRepo}
}

// SearchPlace godoc
//
//	@Summary		Filters places
//	@Description	Get places with pagination support
//	@Tags			places
//	@Produce		json
//	@Param			request	body		dto.SearchPlacesRequest	false	"List of category strings to filter places by."
//	@Success		200		{object}	dto.SearchPlacesResponse
//	@Failure		400		{object}	lib.ErrorResponse	"Invalid limit parameter"
//	@Router			/api/v1/searchPlace [post]
//	@Example		request
//	{
//	  "categories": ["Schulen", "Kindertageseinrichtungen"],
//	  "isBarrierFree": "false",
//	  "hasEmail": "true",
//	  "other": {}
//	}
func (s placeService) SearchPlace(c *gin.Context) {
	var req dto.SearchPlacesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		lib.ResponseBadRequest(c, err, "Error reading body")
		return
	}

	all, err := s.mongoRepo.GetAllMinifiedPlaces(c.Request.Context(), mongo.FilterOptions(req))
	if err != nil {
		lib.ResponseBadRequest(c, err, "couldn't read all places from Mongo")
		return
	}

	c.JSON(http.StatusOK, dto.SearchPlacesResponse{
		Data:    all,
		Message: "ok",
	})
}

// GetPlace godoc
//
//	@Summary		Retrieves a place by its ID
//	@Description	Retrieves a place from the MongoDB database by its ID.
//	@Tags			places
//	@Produce		json
//	@Param			id	path		string					true	"ID of the place to retrieve"
//	@Success		200	{object}	dto.ReadPlacesResponse	"Successful response"
//	@Failure		400	{object}	lib.ErrorResponse		"Bad request"
//	@Router			/api/v1/place/{id} [get]
func (s placeService) GetPlace(c *gin.Context) {
	id := c.Param("id")
	place, err := s.mongoRepo.GetPlaceById(c.Request.Context(), id)
	if err != nil {
		lib.ResponseBadRequest(c, err, "couldn't read place from Mongo by id: "+id)
		return
	}
	if place == nil {
		lib.ResponseNotFound(c, "place not found")
		return
	}
	c.JSON(http.StatusOK, dto.ReadPlacesResponse{
		Data:    place,
		Message: "ok",
	})
}
