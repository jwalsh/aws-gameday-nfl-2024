#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Task 1 - NFL Players Resources ===${NC}"

# Check DynamoDB Table
echo -e "\n${GREEN}DynamoDB Table Details:${NC}"
aws dynamodb describe-table \
    --table-name NflPlayerTable \
    --region us-west-2 | jq '.'

# Get sample data
echo -e "\n${GREEN}Sample Player Data (5 items):${NC}"
aws dynamodb scan \
    --table-name NflPlayerTable \
    --limit 5 \
    --region us-west-2 | jq '.Items'

# Check Import Lambda
echo -e "\n${GREEN}Import Lambda Details:${NC}"
aws lambda get-function \
    --function-name gdQuests-f715654f-c4d2-4a59-8a6-ImportDataFunction-cr6bcACeti7f \
    --region us-west-2 | jq '.Configuration'

# Check latest Lambda logs
echo -e "\n${GREEN}Latest Import Lambda Logs:${NC}"
LOG_GROUP="/aws/lambda/gdQuests-f715654f-c4d2-4a59-8a6-ImportDataFunction-cr6bcACeti7f"

# Get the latest log stream
LATEST_STREAM=$(aws logs describe-log-streams \
    --log-group-name "$LOG_GROUP" \
    --order-by LastEventTime \
    --descending \
    --limit 1 \
    --region us-west-2 | jq -r '.logStreams[0].logStreamName')

if [ ! -z "$LATEST_STREAM" ]; then
    aws logs get-log-events \
        --log-group-name "$LOG_GROUP" \
        --log-stream-name "$LATEST_STREAM" \
        --limit 10 \
        --region us-west-2 | jq '.events[].message'
fi

# Check S3 assets bucket
echo -e "\n${GREEN}S3 Assets:${NC}"
aws s3 ls s3://ws-assets-prod-iad-r-pdx-f3b3f9f1a7d6a3d0/f715654f-c4d2-4a59-8a68-bb036c6e58ac/ \
    --region us-west-2
