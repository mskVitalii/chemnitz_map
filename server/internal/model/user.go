package model

//region User Providers

type UserProvider string

var UserProviders = struct {
	Email  UserProvider
	Google UserProvider
}{
	Email:  "email",
	Google: "google",
}

func ProviderInUserProviders(provider UserProvider, providers []UserProvider) bool {
	for _, b := range providers {
		if b == provider {
			return true
		}
	}
	return false
}

//endregion

//region User Type

type UserType string

var UserTypes = struct {
	Regular UserType
	PRO     UserType
}{
	Regular: "regular",
	PRO:     "pro",
}

//endregion

//region User Status

type Status string

var UserStatuses = struct {
	Active  Status
	Deleted Status
}{
	Active:  "active",
	Deleted: "deleted",
}

//endregion

type UserHome struct {
	Coords Point  `json:"coords" bson:"coords"`
	Name   string `json:"name" bson:"name"`
}

type UserFavourite struct {
	Id       string `json:"_id" bson:"_id"`
	Coords   Point  `json:"coords" bson:"coords"`
	Category string `json:"category" bson:"category"`
}

type User struct {
	Id         string          `json:"_id" bson:"_id"`
	Email      string          `json:"email" bson:"email"`
	Password   string          `json:"password" bson:"password"`
	Providers  []UserProvider  `json:"providers" bson:"providers"`
	Favourites []UserFavourite `json:"favourites" bson:"favourites"`
	Homes      []UserHome      `json:"homes" bson:"homes"`
	UserType   UserType        `json:"userType" bson:"userType"`
	Status     Status          `json:"status" bson:"status"`
}

type UserDBO struct {
	Id         string         `json:"_id" bson:"_id"`
	Email      string         `json:"email" bson:"email"`
	Password   string         `json:"password" bson:"password"`
	Providers  []UserProvider `json:"providers" bson:"providers"`
	Favourites []string       `json:"favourites" bson:"favourites"`
	Homes      []string       `json:"homes" bson:"homes"`
	UserType   UserType       `json:"userType" bson:"userType"`
	Status     Status         `json:"status" bson:"status"`
}
