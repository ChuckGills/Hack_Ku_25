#!/bin/bash

STATE=$1  # e.g., open, closed, all

gh issue list --state "$STATE" --json number,title,author,state,url

