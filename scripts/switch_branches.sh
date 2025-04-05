#!/bin/bash
git checkout "$1" 2>/dev/null || git checkout -b "$1"

