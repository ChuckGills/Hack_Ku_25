#!/bin/bash

PR_NUMBER=$1

gh pr view "$PR_NUMBER" --json number,title,author,state,mergeable,url,body

