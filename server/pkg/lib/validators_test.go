package lib

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestEmail(t *testing.T) {
	email := "msk.vitaly@gmail.com"
	valid := IsValidEmail(email)
	assert.True(t, valid)
}
