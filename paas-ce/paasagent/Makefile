# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
GOVET=$(GOCMD) vet

.PHONY: build build-linux clean

build:
	$(GOBUILD) -o bin/paas_agent -v -i main.go

build-linux:
	GOOS=linux GOARCH=amd64 $(GOBUILD) -o bin/paas_agent -v -i main.go

clean:
	$(GOCLEAN)
