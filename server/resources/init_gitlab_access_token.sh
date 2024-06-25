#!/bin/bash

# Get the directory of the script
script_dir=$(dirname "$(realpath "$0")")

# Define the path to the file to save the access token
token_file="$script_dir/gitlab_access_token.txt"

# Read the GitLab access token from the console
read -p "Enter your GitLab access token: " access_token
echo

# Save the access token to the file
echo "$access_token" > "$token_file"

echo "Access token saved to '$token_file'"
