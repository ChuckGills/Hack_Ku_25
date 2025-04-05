#!/bin/bash

# Script to recursively find and format/lint supported files in a directory

DIRECTORY="${1:-.}"  # Default to current directory if no argument is provided
FORMAT_COMMAND="/app/src/format_command.py" # Path to your format_command.py script [cite: 1]

if [ ! -d "$DIRECTORY" ]; then
  echo "Error: Directory '$DIRECTORY' does not exist."
  exit 1
fi

echo "Scanning directory: $DIRECTORY"

find "$DIRECTORY" -type f \( \
  -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o \
  -name "*.py" -o \
  -name "*.c" -o -name "*.cpp" -o -name "*.h" -o -name "*.hpp" \
\) -print0 | while IFS= read -r -d $'\0' file; do
  echo "Processing file: $file"
  python3 "$FORMAT_COMMAND" "$file"  # Execute format_command.py on the file [cite: 1]
  if [ $? -ne 0 ]; then
    echo "  Error processing file: $file"
  fi
done

echo "Scan and format/lint complete."