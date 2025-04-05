#!/bin/bash

# Script to scan for requirements in Python and JavaScript files

DIRECTORY=${1:-.}

if [ ! -d "$DIRECTORY" ]; then
  echo "Directory '$DIRECTORY' does not exist."
  exit 1
fi

echo "Scanning directory: $DIRECTORY"

# Initialize arrays to hold packages
python_packages=()
js_packages=()

# Find Python files and extract imports
find "$DIRECTORY" -type f -name "*.py" | grep -v "venv\|__pycache__" | while read -r file; do
  imports=$(grep -E "^import\s+|^from\s+" "$file" | sed -E 's/^import\s+([a-zA-Z0-9_]+).*/\1/g; s/^from\s+([a-zA-Z0-9_]+).*/\1/g' | sort -u)
  for pkg in $imports; do
    # Skip standard library modules and local imports
    if [[ "$pkg" != "_"* && "$pkg" != "os" && "$pkg" != "sys" && "$pkg" != "re" && "$pkg" != "json" && "$pkg" != "time" && "$pkg" != "math" && "$pkg" != "random" ]]; then
      python_packages+=("$pkg")
    fi
  done
done

# Find JavaScript files and extract imports
find "$DIRECTORY" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) | grep -v "node_modules" | while read -r file; do
  # Extract package names from import statements
  imports=$(grep -E "import\s+.*from\s+['\"]|require\(['\"]" "$file" | 
            sed -E "s/.*from\s+['\"]([^\.][^'\"]*)['\"].*/\1/g; 
                    s/.*require\(['\"]([^\.][^'\"]*)['\"].*/\1/g" | 
            grep -v "^\." | 
            awk -F'/' '{print $1}' | 
            sort -u)
  
  for pkg in $imports; do
    js_packages+=("$pkg")
  done
done

# Remove duplicates by creating a temporary file
echo "${python_packages[@]}" | tr ' ' '\n' | sort | uniq > /tmp/py_requirements.txt
echo "${js_packages[@]}" | tr ' ' '\n' | sort | uniq > /tmp/js_requirements.txt

# Create requirements.txt
if [ -s /tmp/py_requirements.txt ]; then
  cat /tmp/py_requirements.txt > "$DIRECTORY/requirements.txt"
  echo "Created Python requirements.txt with $(wc -l < /tmp/py_requirements.txt) packages"
else
  echo "No Python packages found"
  echo "" > "$DIRECTORY/requirements.txt"
fi

# Create package.json or update existing one
if [ -s /tmp/js_requirements.txt ]; then
  if [ -f "$DIRECTORY/package.json" ]; then
    # Package.json exists, we should update it
    echo "Updating existing package.json with $(wc -l < /tmp/js_requirements.txt) JavaScript packages"
    # This is a simplified update that would need a more robust JSON parser for production
    # Consider using jq for proper JSON manipulation
    if command -v jq &> /dev/null; then
      # Using jq if available
      tmp_package=$(mktemp)
      while read -r pkg; do
        if [ -n "$pkg" ]; then
          cat "$DIRECTORY/package.json" | 
            jq --arg pkg "$pkg" '.dependencies[$pkg] = "latest"' > "$tmp_package"
          mv "$tmp_package" "$DIRECTORY/package.json"
        fi
      done < /tmp/js_requirements.txt
    else
      echo "Warning: jq not found. Skipping package.json update. Install jq for better JSON handling."
    fi
  else
    # Create a new package.json
    echo "Creating new package.json with $(wc -l < /tmp/js_requirements.txt) JavaScript packages"
    echo '{
  "name": "project",
  "version": "1.0.0",
  "dependencies": {' > "$DIRECTORY/package.json"
    
    first=true
    while read -r pkg; do
      if [ -n "$pkg" ]; then
        if [ "$first" = true ]; then
          echo "    \"$pkg\": \"latest\"" >> "$DIRECTORY/package.json"
          first=false
        else
          echo "    ,\"$pkg\": \"latest\"" >> "$DIRECTORY/package.json"
        fi
      fi
    done < /tmp/js_requirements.txt
    
    echo '  }
}' >> "$DIRECTORY/package.json"
  fi
else
  echo "No JavaScript packages found"
fi

# Clean up
rm /tmp/py_requirements.txt /tmp/js_requirements.txt 2>/dev/null

echo "Scan complete!"