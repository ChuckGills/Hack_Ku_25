#!/bin/bash

# List all repositories in JSON format
gh repo list --limit 100 --json name,url,visibility,updatedAt

