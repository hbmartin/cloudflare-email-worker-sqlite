#!/bin/bash

# Check if a file is provided as argument
if [ $# -ne 1 ]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

input_file="$1"

# Check if file exists
if [ ! -f "$input_file" ]; then
    echo "Error: File '$input_file' not found"
    exit 1
fi

# Create a temporary file
temp_file=$(mktemp)

# Read the input file line by line
while IFS= read -r line; do
    # Find all $PLACEHOLDER patterns in the line
    while [[ $line =~ \$([A-Za-z_][A-Za-z0-9_]*) ]]; do
        placeholder=${BASH_REMATCH[1]}
        value=${!placeholder}

        # If environment variable exists, replace it; otherwise, keep the placeholder
        if [ -n "$value" ]; then
            line=${line/\$$placeholder/$value}
        else
            echo "Warning: Environment variable '$placeholder' not found" >&2
            break  # Prevent infinite loop if variable doesn't exist
        fi
    done
    echo "$line" >> "$temp_file"
done < "$input_file"

# Move temporary file to original file
mv "$temp_file" "$input_file"
