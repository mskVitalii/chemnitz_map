package lib

import (
	"github.com/stretchr/testify/assert"
	"log"
	"testing"
)

func TestPasswords(t *testing.T) {
	password := "securepassword"
	valid := IsValidPassword(password)
	assert.True(t, valid)
	hash := HashPassword(password)
	log.Println(password, hash)
	assert.NotEqual(t, hash, password)
}
