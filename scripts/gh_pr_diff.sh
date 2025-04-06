#!/usr/bin/env bash

REPO_SLUG="$1"
PR_NUMBER="$2"

gh pr diff "$PR_NUMBER" --repo "$REPO_SLUG"
