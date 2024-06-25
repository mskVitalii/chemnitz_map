package mongo_test

import (
	"context"
	"dwt/internal/adapter/mongo"
	"dwt/internal/model"
	"dwt/internal/utils/config"
	"dwt/pkg/clients"
	"dwt/pkg/lib"
	"dwt/pkg/telemetry"
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
	"testing"
)

func TestSoftDeleteUser(t *testing.T) {
	// Arrange
	db, repo, user, ctx := arrangeMongo(t)

	// Act: Delete user
	err := repo.DeleteUser(ctx, user.Id)
	assert.NoError(t, err)

	// Assert: Check status "deleted"
	retrievedUser, err := repo.GetUserByID(ctx, user.Id)
	assert.NoError(t, err)
	assert.Equal(t, model.UserStatuses.Deleted, retrievedUser.Status)

	cleanup(t, db, ctx)
}

func TestUserTypes(t *testing.T) {
	// Arrange
	db, repo, user, ctx := arrangeMongo(t)

	// Act =================== regular
	// regular user can add only 1 home & 1 favourite
	err := repo.UpdateUser(ctx, user.Id, model.User{
		Id:       user.Id,
		Email:    user.Email,
		Password: user.Password,
		Favourites: []model.UserFavourite{{
			Id:       "665f6d57edaa13b1f5228a3b",
			Coords:   model.Point{X: 12.8774888058499, Y: 50.8310585585904},
			Category: "Jugendberufshilfen",
		}},
		Homes: []model.UserHome{
			{Coords: model.Point{X: 1.0, Y: 1.0}, Name: "home1"}},
		UserType: model.UserTypes.Regular,
		Status:   user.Status,
	})
	assert.NoError(t, err)
	userAfterAddingHome, err := repo.GetUserByID(ctx, user.Id)
	assert.NoError(t, err)
	assert.Equal(t, len(userAfterAddingHome.Homes), 1)
	assert.Equal(t, len(userAfterAddingHome.Favourites), 1)

	err = repo.UpdateUser(ctx, user.Id, model.User{
		Id:       user.Id,
		Email:    user.Email,
		Password: user.Password,
		Favourites: []model.UserFavourite{{
			Id:       "665f6d57edaa13b1f5228a3b",
			Coords:   model.Point{X: 12.8774888058499, Y: 50.8310585585904},
			Category: "Jugendberufshilfen",
		}, {
			Id:       "665f6d57edaa13b1f5228a3c",
			Coords:   model.Point{X: 12.8904748101941, Y: 50.809930951272},
			Category: "Jugendberufshilfen",
		}},
		Homes: []model.UserHome{
			{Coords: model.Point{X: 1.0, Y: 1.0}, Name: "home1"},
			{Coords: model.Point{X: 2.0, Y: 2.0}, Name: "home2"}},
		UserType: model.UserTypes.Regular,
		Status:   user.Status,
	})
	assert.NoError(t, err)
	userAfterAddingHome, err = repo.GetUserByID(ctx, user.Id)
	assert.NoError(t, err)
	assert.Equal(t, len(userAfterAddingHome.Homes), 1)
	assert.Equal(t, len(userAfterAddingHome.Favourites), 1)

	// Act =================== PRO
	err = repo.UpdateUser(ctx, user.Id, model.User{
		Id:         user.Id,
		Email:      user.Email,
		Password:   user.Password,
		Favourites: user.Favourites,
		Homes:      user.Homes,
		UserType:   model.UserTypes.PRO,
		Status:     user.Status,
	})
	assert.NoError(t, err)

	// PRO user can add more than 1 home & more than 1 favourite place
	err = repo.UpdateUser(ctx, user.Id, model.User{
		Id:        user.Id,
		Email:     user.Email,
		Password:  user.Password,
		Providers: []model.UserProvider{model.UserProviders.Google},
		Favourites: []model.UserFavourite{{
			Id:       "665f6d57edaa13b1f5228a3b",
			Coords:   model.Point{X: 12.8774888058499, Y: 50.8310585585904},
			Category: "Jugendberufshilfen",
		}, {
			Id:       "665f6d57edaa13b1f5228a3c",
			Coords:   model.Point{X: 12.8904748101941, Y: 50.809930951272},
			Category: "Jugendberufshilfen",
		}},
		Homes: []model.UserHome{
			{Coords: model.Point{X: 1.0, Y: 1.0}, Name: "home1"},
			{Coords: model.Point{X: 2.0, Y: 2.0}, Name: "home2"}},
		UserType: model.UserTypes.PRO,
		Status:   user.Status,
	})
	assert.NoError(t, err)
	userAfterAddingHome, err = repo.GetUserByID(ctx, user.Id)
	assert.NoError(t, err)
	assert.Equal(t, len(userAfterAddingHome.Homes), 2)
	assert.Equal(t, len(userAfterAddingHome.Favourites), 2)

	cleanup(t, db, ctx)
}

func arrangeMongo(t *testing.T) (*clients.MongoDb, mongo.IMongoRepository, model.User, context.Context) {
	cfg := config.GetConfig("../../../")
	telemetry.SetupLogger(cfg)

	// Arrange
	db, err := mongo.SetupMongo(&cfg.Mongo)
	if err != nil {
		t.Fatal(err)
	}

	repo := mongo.New(cfg, &clients.MongoDb{
		Database:    "test_db",
		Client:      db.Client,
		Collections: clients.MongoCollectionsNames})

	user := model.User{
		Id:         primitive.NewObjectID().Hex(),
		Email:      "test@example.com",
		Password:   lib.HashPassword("password"),
		Favourites: []model.UserFavourite{},
		Homes:      []model.UserHome{},
		UserType:   model.UserTypes.Regular,
		Status:     model.UserStatuses.Active,
	}

	ctx := context.TODO()
	err = repo.CreateUser(ctx, user)
	assert.NoError(t, err)

	_, err = repo.GetUserByID(ctx, user.Id)
	assert.NoError(t, err)

	return db, repo, user, ctx
}

func cleanup(t *testing.T, db *clients.MongoDb, ctx context.Context) {
	err := db.Client.Database("test_db").Drop(ctx)
	assert.NoError(t, err)
	defer func(Log *zap.Logger) {
		err := Log.Sync()
		assert.NoError(t, err)
	}(telemetry.Log)
}
