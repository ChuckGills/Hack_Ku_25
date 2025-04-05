#!/bin/bash

TITLE="$1"
BODY="$2"
BASE="$3"
HEAD="$4"

gh pr create \
  --title "$TITLE" \
  --body "$BODY" \
  --base "$BASE" \
  --head "$HEAD" \
  --json number,url,state

