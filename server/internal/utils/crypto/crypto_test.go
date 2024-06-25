package crypto_test

import (
	"dwt/internal/model"
	"dwt/internal/utils/config"
	"dwt/internal/utils/crypto"
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestUserEncryption(t *testing.T) {
	cfg := config.GetConfig("../../../")
	passphrase := cfg.CryptoKey

	user := model.User{
		Email:    "user@example.com",
		Password: "password",
		Favourites: []model.UserFavourite{{
			Id:       "place_id_1",
			Coords:   model.Point{X: 1.0, Y: 1.0},
			Category: "Schulen",
		}, {
			Id:       "place_id_2",
			Coords:   model.Point{X: 2.0, Y: 2.0},
			Category: "Schulen",
		}},
		Providers: []model.UserProvider{model.UserProviders.Google},
		Homes: []model.UserHome{
			{Coords: model.Point{X: 1.0, Y: 1.0}, Name: "home1"},
			{Coords: model.Point{X: 2.0, Y: 2.0}, Name: "home2"}},
		UserType: model.UserTypes.Regular,
		Status:   model.UserStatuses.Active,
	}

	encryptedUser, err := crypto.EncryptUserFields(user, passphrase)
	assert.NoError(t, err)
	fmt.Println("Encrypted User:", encryptedUser)

	decryptedUser, err := crypto.DecryptUserFields(*encryptedUser, passphrase)
	assert.NoError(t, err)
	fmt.Println("Decrypted User:", decryptedUser)

	assert.Equal(t, decryptedUser.Id, encryptedUser.Id)
	assert.Equal(t, decryptedUser.Status, encryptedUser.Status)
	assert.Equal(t, decryptedUser.UserType, encryptedUser.UserType)
	assert.Equal(t, decryptedUser.Password, encryptedUser.Password)
	assert.Equal(t, decryptedUser.Email, encryptedUser.Email)
	assert.NotEqual(t, decryptedUser.Favourites, encryptedUser.Favourites)
	assert.NotEqual(t, decryptedUser.Favourites[0], encryptedUser.Favourites[0])
	assert.NotEqual(t, decryptedUser.Favourites[1], encryptedUser.Favourites[1])
	assert.NotEqual(t, decryptedUser.Homes, encryptedUser.Homes)
	assert.NotEqual(t, decryptedUser.Homes[0], encryptedUser.Homes[0])
	assert.NotEqual(t, decryptedUser.Homes[1], encryptedUser.Homes[1])
}
