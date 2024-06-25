package mongo

import (
	"context"
	"dwt/internal/model"
	"dwt/internal/utils/config"
	"dwt/pkg/clients"
	"dwt/pkg/telemetry"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
	"time"
)

func SetupMongo(cfg *config.MongoConfig) (*clients.MongoDb, error) {
	ctx := context.Background()
	db, err := clients.ConnectToMongoDb(ctx,
		cfg.User,
		cfg.Password,
		cfg.HostName,
		cfg.Database,
		cfg.Port)
	if err != nil {
		return nil, err
	}

	if err = db.Client.Ping(ctx, nil); err != nil {
		telemetry.Log.Fatal("failed to ping MongoDB server", zap.Error(err))
		return nil, err
	}
	telemetry.Log.Info("Connected to MongoDB")

	if err := CreateUserCollection(db); err != nil {
		telemetry.Log.Fatal("failed to create user collection", zap.Error(err))
		return nil, err
	}

	return db, nil
}

func IsPlacesCollectionExist(db *clients.MongoDb) bool {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	database := db.Client.Database(db.Database)

	collectionNames, err := database.ListCollectionNames(ctx, bson.D{})
	if err != nil {
		return false
	}

	for _, name := range collectionNames {
		if name == db.Collections.Places {
			return true
		}
	}
	return false
}

func CreateUserCollection(db *clients.MongoDb) error {
	ctx := context.Background()
	err := db.Client.Database(db.Database).CreateCollection(ctx, db.Collections.Users)
	if err != nil && !mongo.IsDuplicateKeyError(err) {
		return err
	}
	indexModel := mongo.IndexModel{
		Keys:    bson.D{{Key: "email", Value: 1}}, // index in ascending order or use -1 for descending order
		Options: options.Index().SetUnique(true)}

	coll := db.Client.Database(db.Database).Collection(db.Collections.Users)
	if _, err = coll.Indexes().CreateOne(ctx, indexModel); err != nil {
		return err
	}

	return nil
}

func LoadDatasetsToDB(db *clients.MongoDb, data []model.Place) {
	collection := db.Client.Database(db.Database).Collection(db.Collections.Places)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	documents := make([]interface{}, len(data))
	for i, poi := range data {
		documents[i] = poi
	}

	if len(documents) == 0 {
		telemetry.Log.Info("No documents to insert")
		return
	}

	if len(documents) > 0 {
		_, err := collection.InsertMany(ctx, documents)
		if err != nil {
			panic("Failed to insert documents")
		} else {
			telemetry.Log.Info("Successfully inserted documents")
		}
	}
}
