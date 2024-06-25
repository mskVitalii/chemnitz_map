package mongo

import (
	"context"
	"dwt/internal/model"
	"dwt/internal/utils/config"
	"dwt/internal/utils/crypto"
	"dwt/pkg/clients"
	"dwt/pkg/telemetry"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
	"strings"
)

type IMongoRepository interface {
	GetAllMinifiedPlaces(ctx context.Context, filter FilterOptions) ([]model.PlaceMinified, error)
	GetPlaceById(ctx context.Context, placeId string) (*model.Place, error)
	GetExistedPlacesIdsByIds(ctx context.Context, placeIds []string) ([]string, error)

	CreateUser(ctx context.Context, user model.User) error
	GetUserByID(ctx context.Context, id string) (*model.User, error)
	GetUserByEmail(ctx context.Context, email string) (*model.User, error)
	UpdateUser(ctx context.Context, id string, user model.User) error
	DeleteUser(ctx context.Context, id string) error
}

type repository struct {
	config *config.Config
	client *clients.MongoDb
}

func New(cfg *config.Config, client *clients.MongoDb) IMongoRepository {
	return &repository{cfg, client}
}

// region Places

type FilterOptions struct {
	Categories    []string
	IsBarrierFree bool
	HasEmail      bool
	Other         map[string]string
}

func (r repository) GetAllMinifiedPlaces(ctx context.Context, filter FilterOptions) ([]model.PlaceMinified, error) {
	var result []model.PlaceMinified

	coll := r.client.Client.Database(r.client.Database).Collection(r.client.Collections.Places)

	// filtrate
	filterQuery := bson.M{}
	if len(filter.Categories) > 0 {
		filterQuery["category"] = bson.M{"$in": filter.Categories}
	}
	if filter.IsBarrierFree == true {
		filterQuery["other.barrierefrei"] = bson.M{"$exists": true, "$eq": "1"}
	}
	if filter.HasEmail == true {
		filterQuery["other.email"] = bson.M{"$ne": ""}
	}
	for key, value := range filter.Other {
		filterQuery["other."+strings.ToLower(key)] = value
	}

	curr, err := coll.Find(ctx, filterQuery)
	if err != nil {
		return result, err
	}

	for curr.Next(ctx) {
		var el model.PlaceMinified
		if err := curr.Decode(&el); err != nil {
			telemetry.Log.Error("[GetAllMinifiedPlaces] error decoding doc", zap.Error(err), telemetry.TraceForZapLog(ctx))
			continue
		}

		result = append(result, el)
	}

	return result, nil
}

func (r repository) GetPlaceById(ctx context.Context, placeId string) (*model.Place, error) {
	var result model.Place
	coll := r.client.Client.Database(r.client.Database).Collection(r.client.Collections.Places)
	if err := coll.FindOne(ctx, bson.M{"_id": placeId}).Decode(&result); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &result, nil
}

// GetExistedPlacesIdsByIds used to check places
func (r repository) GetExistedPlacesIdsByIds(ctx context.Context, placeIds []string) ([]string, error) {
	coll := r.client.Client.Database(r.client.Database).Collection(r.client.Collections.Places)

	filter := bson.M{"_id": bson.M{"$in": placeIds}}
	cursor, err := coll.Find(ctx, filter, options.Find().SetProjection(bson.M{"_id": 1}))
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var existedIds []string
	for cursor.Next(ctx) {
		var result struct {
			ID primitive.ObjectID `bson:"_id"`
		}
		if err := cursor.Decode(&result); err != nil {
			return nil, err
		}
		existedIds = append(existedIds, result.ID.Hex())
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return existedIds, nil
}

//endregion

//region Users

func (r repository) CreateUser(ctx context.Context, user model.User) error {
	coll := r.client.Client.Database(r.client.Database).Collection(r.client.Collections.Users)
	encryptedUser, err := crypto.EncryptUserFields(user, r.config.CryptoKey)
	if err != nil {
		return err
	}
	_, err = coll.InsertOne(ctx, encryptedUser)
	return err
}

func (r repository) GetUserByID(ctx context.Context, id string) (*model.User, error) {
	coll := r.client.Client.Database(r.client.Database).Collection(r.client.Collections.Users)
	var user model.UserDBO
	err := coll.FindOne(ctx, bson.M{"_id": id}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	decryptedUser, err := crypto.DecryptUserFields(user, r.config.CryptoKey)
	if err != nil {
		return nil, err
	}
	return decryptedUser, nil
}

func (r repository) UpdateUser(ctx context.Context, id string, user model.User) error {
	coll := r.client.Client.Database(r.client.Database).Collection(r.client.Collections.Users)
	if len(user.Homes) > 1 && user.UserType == model.UserTypes.Regular {
		user.Homes = []model.UserHome{user.Homes[0]}
	}
	if len(user.Favourites) > 1 && user.UserType == model.UserTypes.Regular {
		user.Favourites = []model.UserFavourite{user.Favourites[0]}
	}

	encryptedUser, err := crypto.EncryptUserFields(user, r.config.CryptoKey)
	_, err = coll.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": encryptedUser})
	return err
}

// DeleteUser performs soft-delete by changing status to "deleted"
func (r repository) DeleteUser(ctx context.Context, id string) error {
	coll := r.client.Client.Database(r.client.Database).Collection(r.client.Collections.Users)

	update := bson.M{"$set": bson.M{"status": model.UserStatuses.Deleted}}
	_, err := coll.UpdateOne(ctx, bson.M{"_id": id}, update)
	return err
}

func (r repository) GetUserByEmail(ctx context.Context, email string) (*model.User, error) {
	coll := r.client.Client.Database(r.client.Database).Collection(r.client.Collections.Users)
	var user model.UserDBO
	err := coll.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	decryptedUser, err := crypto.DecryptUserFields(user, r.config.CryptoKey)
	if err != nil {
		return nil, err
	}
	return decryptedUser, nil
}

//endregion
