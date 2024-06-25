package google

import (
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type Google struct {
	OAuthConfig *oauth2.Config
}

func InitGoogleOAuth(redirectURL, clientID, clientSecret string) Google {
	googleOauthConfig := &oauth2.Config{
		RedirectURL:  redirectURL,
		ClientID:     clientID,
		ClientSecret: clientSecret,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}
	return Google{googleOauthConfig}
}
