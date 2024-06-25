package model

type PlaceMinified struct {
	Id       *string `json:"_id" bson:"_id"`
	Coords   Point   `json:"coords" bson:"coords"`
	Category string  `json:"category" bson:"category"`
}

type Place struct {
	Id         string            `json:"_id" bson:"_id"`
	Coords     Point             `json:"coords" bson:"coords"`
	Category   string            `json:"category" bson:"category"`
	OriginalId string            `json:"originalId" bson:"originalId"`
	Telephone  string            `json:"telephone" bson:"telephone"`
	PostCode   string            `json:"postCode" bson:"postCode"`
	Street     string            `json:"street" bson:"street"`
	Location   string            `json:"location" bson:"location"`
	Other      map[string]string `json:"other" bson:"other"`
}
