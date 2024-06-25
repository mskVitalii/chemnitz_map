package lib

import (
	"os"
	"path/filepath"
	"strings"
)

func ReadFilesFromDir(dir, ext string) ([]string, error) {
	var paths []string

	files, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	for _, file := range files {
		if filepath.Ext(file.Name()) == "."+ext {
			filePath := filepath.Join(dir, file.Name())
			paths = append(paths, filePath)
		}
	}

	return paths, nil
}

func GetFileNameWithoutExtension(filePath string) string {
	base := filepath.Base(filePath)
	return strings.TrimSuffix(base, filepath.Ext(base))
}
