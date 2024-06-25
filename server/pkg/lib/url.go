package lib

import "net/url"

func GetDomainFromURL(inputURL string) (string, error) {
	parsedURL, err := url.Parse(inputURL)
	if err != nil {
		return "", err
	}
	return parsedURL.Hostname(), nil
}
