#!/bin/bash
# build react and upload build file to S3
# use export value for AWS Account ID and S3 bucket name

cd $(dirname "$0")

# Check if an argument is provided
if [ -z "$1" ]; then
    echo "Error: No S3 bucket name provided."
    echo "Usage: $0 <bucket_name>"
    exit 1
fi

# Check if the argument is a valid S3 bucket name
BUCKET_NAME="$1"
if ! [[ "$BUCKET_NAME" =~ ^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$ ]]; then
    echo "Error: Invalid S3 bucket name provided."
    echo "Bucket names must be between 3 and 63 characters long, start and end with a lowercase letter or number, and can only contain lowercase letters, numbers, and hyphens."
    exit 1
fi

set -e
npm install
npm run build
aws s3 sync dist s3://$BUCKET_NAME
