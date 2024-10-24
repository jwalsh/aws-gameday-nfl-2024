#!/bin/bash
echo "Deploying AWS GameDay NFL resources..."
aws cloudformation deploy \
    --template-file infrastructure/cloudformation/main.yml \
    --stack-name nfl-digital-experience \
    --parameter-overrides TeamNumber=$TEAM_NUMBER \
    --capabilities CAPABILITY_IAM
