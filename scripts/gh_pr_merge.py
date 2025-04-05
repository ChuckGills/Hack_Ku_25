#!/bin/bash
PR_NUMBER=$1
gh pr merge "$PR_NUMBER" --merge --auto --delete-branch --json merged,state,url

