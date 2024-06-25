package lib

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestDomains(t *testing.T) {
	url, err := GetDomainFromURL("http://localhost:3000")
	assert.NoError(t, err)
	assert.Equal(t, "localhost", url)
}
