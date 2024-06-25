package routes

import "github.com/gin-gonic/gin"

const (
	searchPlaces = "/searchPlace"
	readPlace    = "/place/:id"
)

type IPlaceService interface {
	SearchPlace(c *gin.Context)
	GetPlace(c *gin.Context)
}

func RegisterPlaceRoutes(g *gin.RouterGroup, placeService IPlaceService) {
	g.POST(searchPlaces, placeService.SearchPlace)
	g.GET(readPlace, placeService.GetPlace)
}
