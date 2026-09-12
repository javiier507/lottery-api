current-dir := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
SHELL = /bin/sh

notification:
	act --secret-file .env --workflows .github/workflows/notification.yml --job notification

scraping:
	act --secret-file .env --workflows .github/workflows/scraping.yml --job scraping
