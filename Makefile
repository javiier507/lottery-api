current-dir := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
SHELL = /bin/sh

github-action-run:
	act --secret-file github-action.secrets
