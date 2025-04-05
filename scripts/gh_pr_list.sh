#!/bin/bash
gh pr list --state "$1" --json number,title,author,state,url

