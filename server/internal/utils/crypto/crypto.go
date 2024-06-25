package crypto

import (
	"dwt/internal/model"
	"dwt/pkg/lib"
	"encoding/json"
)

func EncryptUserFields(user model.User, passphrase string) (*model.UserDBO, error) {
	key := lib.GenerateKey(passphrase)
	encryptedUser := model.UserDBO{
		Id:         user.Id,
		Email:      user.Email,
		Password:   user.Password,
		Providers:  user.Providers,
		Favourites: make([]string, len(user.Favourites)),
		Homes:      make([]string, len(user.Homes)),
		UserType:   user.UserType,
		Status:     user.Status,
	}

	// I think it is not necessary to encrypt emails
	//encryptedEmail, err := utils.Encrypt([]byte(user.Email), key)
	//if err != nil {
	//	return err
	//}
	//user.Email = encryptedEmail

	for i, fav := range user.Favourites {
		userFavJSON, err := json.Marshal(fav)
		if err != nil {
			return nil, err
		}
		encryptedFav, err := lib.Encrypt(userFavJSON, key)

		if err != nil {
			return nil, err
		}
		encryptedUser.Favourites[i] = encryptedFav
	}

	for i, home := range user.Homes {
		userHomeJSON, err := json.Marshal(home)
		if err != nil {
			return nil, err
		}
		encryptedHome, err := lib.Encrypt(userHomeJSON, key)

		if err != nil {
			return nil, err
		}
		encryptedUser.Homes[i] = encryptedHome
	}

	return &encryptedUser, nil
}

func DecryptUserFields(user model.UserDBO, passphrase string) (*model.User, error) {
	key := lib.GenerateKey(passphrase)
	decryptedUser := model.User{
		Id:         user.Id,
		Email:      user.Email,
		Password:   user.Password,
		Providers:  user.Providers,
		Favourites: make([]model.UserFavourite, len(user.Favourites)),
		Homes:      make([]model.UserHome, len(user.Homes)),
		UserType:   user.UserType,
		Status:     user.Status,
	}

	//decryptedEmail, err := utils.Decrypt(user.Email, key)
	//if err != nil {
	//	return nil, err
	//}
	//user.Email = decryptedEmail

	for i, fav := range user.Favourites {
		decryptedFav, err := lib.Decrypt(fav, key)
		if err != nil {
			return nil, err
		}

		var userFav model.UserFavourite
		err = json.Unmarshal([]byte(decryptedFav), &userFav)
		if err != nil {
			return nil, err
		}

		decryptedUser.Favourites[i] = userFav
	}

	for i, home := range user.Homes {
		decryptedHome, err := lib.Decrypt(home, key)
		if err != nil {
			return nil, err
		}

		var userHome model.UserHome
		err = json.Unmarshal([]byte(decryptedHome), &userHome)
		if err != nil {
			return nil, err
		}

		decryptedUser.Homes[i] = userHome
	}

	return &decryptedUser, nil
}
