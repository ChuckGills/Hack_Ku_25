#!/usr/bin/env bash

REPO_SLUG="$1"
STATE="$2" 

gh pr list --repo "$REPO_SLUG" --state "$STATE" --json number,title,author
