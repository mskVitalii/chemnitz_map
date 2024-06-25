#!/bin/bash

script_dir=$(dirname "$(realpath "$0")")

# Define the base URL for the GitLab API
base_url="https://gitlab.hrz.tu-chemnitz.de/api/v4"

# Define the project ID
project_id="20290"

# Define the path to the file containing the access token
token_file="$script_dir/gitlab_access_token.txt"

# Check if the token file exists
if [ ! -f "$token_file" ]; then
    echo "Error: Token file '$token_file' not found."
    exit 1
fi

# Read access token from file
access_token=$(<"$token_file")

# Define the path to the env files
example_file="$script_dir/../.env.example"
production_file="$script_dir/../.env.production"

# Check if the .env.example file exists
if [ ! -f "$example_file" ]; then
    echo "Error: .env.example file '$example_file' not found."
    exit 1
fi

# shellcheck disable=SC2188
> "$production_file"

# Read the .env.example file line by line
while IFS= read -r line; do
    # Check if the line is not empty
    if [ -n "$line" ]; then
        # Remove the "=" character at the end of the line
        key="${line%=}"
        # Run query GET /projects/:id/variables/:key
        response=$(curl -s --header "PRIVATE-TOKEN: $access_token" "$base_url/projects/$project_id/variables/$key")
        value=$(echo "$response" | grep -o '"value":"[^"]*' | cut -d'"' -f4)
        echo "$key=$value" >> "$production_file"
    fi
done < "$example_file"
