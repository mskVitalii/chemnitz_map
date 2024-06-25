package utils

import (
	"bytes"
	"dwt/internal/model"
	"dwt/internal/utils/config"
	"dwt/pkg/lib"
	"dwt/pkg/telemetry"
	"encoding/csv"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
	"os"
	"strconv"
	"strings"
	"sync"
)

func ReadDatasets(cfg *config.Config) ([]model.Place, error) {
	csvFiles, err := lib.ReadFilesFromDir(cfg.DatasetsPath, "csv")
	if err != nil {
		return nil, err
	}

	result, err := readCSVFilesConcurrently(csvFiles)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func readCSVFilesConcurrently(files []string) ([]model.Place, error) {
	var wg sync.WaitGroup
	var mutex sync.Mutex
	var allData []model.Place
	errChan := make(chan error, len(files))

	for _, filePath := range files {
		wg.Add(1)
		go func(filePath string) {
			defer wg.Done()
			data, err := readCSVPlaces(filePath)
			if err != nil {
				errChan <- err
				return
			}
			mutex.Lock()
			allData = append(allData, data...)
			mutex.Unlock()
		}(filePath)
	}

	wg.Wait()
	close(errChan)

	for err := range errChan {
		if err != nil {
			return nil, err
		}
	}

	return allData, nil
}

func readCSVPlaces(filePath string) ([]model.Place, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {
			telemetry.Log.Fatal("failed to close file", zap.Error(err))
		}
	}(file)
	fileName := lib.GetFileNameWithoutExtension(filePath)

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}
	if len(records) == 0 {
		return nil, errors.New("empty CSV file")
	}
	fields := records[0]

	// Remove BOM from CSV
	firstFieldBytes := bytes.TrimPrefix([]byte(fields[0]), []byte{0xEF, 0xBB, 0xBF})
	fields[0] = string(firstFieldBytes)

	var data = make([]model.Place, len(records)-1)

	for row := 1; row < len(records); row++ {
		poi := model.Place{
			Id:       primitive.NewObjectID().Hex(),
			Category: fileName,
			Coords:   model.Point{X: -1, Y: -1},
			Other:    map[string]string{}}

		for fieldI := 0; fieldI < len(fields); fieldI++ {
			key := fields[fieldI]
			value := records[row][fieldI]
			switch key {
			case "ID":
				poi.OriginalId = value
			case "STRASSE":
				poi.Street = value
			case "PLZ":
				poi.PostCode = value
			case "ORT":
				poi.Location = value
			case "TELEFON":
				poi.Telephone = value
			case "X":
				{
					if x, err := strconv.ParseFloat(value, 64); err == nil {
						poi.Coords.X = x
					}
				}
			case "Y":
				{
					if y, err := strconv.ParseFloat(value, 64); err == nil {
						poi.Coords.Y = y
					}
				}
			default:
				poi.Other[strings.ToLower(key)] = value
			}
		}
		data[row-1] = poi
	}

	return data, nil
}
