#!/bin/bash

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Create data directory in our repo
DATA_DIR="data"
mkdir -p "${DATA_DIR}/analytics"
mkdir -p "${DATA_DIR}/quest-logs"

# Define buckets
ANALYTICS_BUCKET="nfl-analytics-challenged-860939655105"
QUEST_BUCKET="gdquests-ee5207ee-f563-4c78-8709-e243-ssmlogbucket-qudagq89oknm"

echo -e "${BLUE}Starting data sync from GameDay buckets...${NC}"

# Sync Analytics bucket
echo -e "${GREEN}Syncing NFL Analytics data...${NC}"
aws s3 sync "s3://${ANALYTICS_BUCKET}" "${DATA_DIR}/analytics" \
    --exclude "*.log" \
    --no-progress

# Sync Quest logs bucket
echo -e "${GREEN}Syncing GameDay Quest logs...${NC}"
aws s3 sync "s3://${QUEST_BUCKET}" "${DATA_DIR}/quest-logs" \
    --no-progress

# Create metadata file
echo -e "${GREEN}Creating sync metadata...${NC}"
cat > "${DATA_DIR}/sync-info.json" << EOL
{
    "last_sync": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "team_number": "${TEAM_NUMBER}",
    "buckets": {
        "analytics": "${ANALYTICS_BUCKET}",
        "quest_logs": "${QUEST_BUCKET}"
    }
}
EOL

# Add to .gitignore if not already present
if ! grep -q "^data/" .gitignore; then
    echo -e "\n# GameDay data\ndata/" >> .gitignore
    echo -e "${BLUE}Added data/ to .gitignore${NC}"
fi

echo -e "${GREEN}Data sync complete!${NC}"
echo -e "Data stored in:"
echo -e "  - ${DATA_DIR}/analytics"
echo -e "  - ${DATA_DIR}/quest-logs"
echo -e "\nUse 'tree ${DATA_DIR}' to view the structure"
