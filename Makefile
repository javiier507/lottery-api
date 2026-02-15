current-dir := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
SHELL = /bin/sh

notification:
	act --secret-file .env --workflows .github/workflows/notification.yml --job notification

scrapping:
	act --secret-file .env --workflows .github/workflows/scrapping.yml --job scraping

scrapping-llm:
	act --secret-file .env --var-file .env --workflows .github/workflows/scrapping-llm.yml --job scrapping-llm
