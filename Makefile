# AWS Resource Discovery Makefile

.PHONY: help api-ls lambda-ls dynamo-ls all-apis all-lambdas all-dynamo all

help:
	@echo "AWS Resource Discovery Commands:"
	@echo "make api-ls        - List all API Gateway APIs (REST and HTTP)"
	@echo "make lambda-ls     - List all Lambda functions"
	@echo "make dynamo-ls     - List all DynamoDB tables"
	@echo "make all-apis      - Detailed API Gateway information"
	@echo "make all-lambdas   - Detailed Lambda information"
	@echo "make all-dynamo    - Detailed DynamoDB information"
	@echo "make all          - Show all AWS resources"

# API Gateway Discovery
api-ls:
	@echo "\n=== REST APIs ==="
	aws apigateway get-rest-apis --region ${AWS_DEFAULT_REGION} | jq '.'
	@echo "\n=== HTTP APIs ==="
	aws apigatewayv2 get-apis --region ${AWS_DEFAULT_REGION} | jq '.' || echo "No HTTP APIs found"

all-apis:
	@echo "\n=== REST APIs with Details ==="
	@echo "Listing APIs..."
	aws apigateway get-rest-apis --region ${AWS_DEFAULT_REGION} | jq '.'
	@echo "\n=== Usage Plans ==="
	aws apigateway get-usage-plans --region ${AWS_DEFAULT_REGION} | jq '.'
	@echo "\n=== API Details ==="
	for api in $$(aws apigateway get-rest-apis --query 'items[*].id' --output text --region ${AWS_DEFAULT_REGION}); do \
		echo "\nAuthorizers for API: $$api"; \
		aws apigateway get-authorizers --rest-api-id $$api --region ${AWS_DEFAULT_REGION} | jq '.' || echo "No authorizers found"; \
		echo "\nResources for API: $$api"; \
		aws apigateway get-resources --rest-api-id $$api --region ${AWS_DEFAULT_REGION} | jq '.' || echo "No resources found"; \
		echo "\nStages for API: $$api"; \
		aws apigateway get-stages --rest-api-id $$api --region ${AWS_DEFAULT_REGION} | jq '.' || echo "No stages found"; \
	done

# Lambda Discovery
lambda-ls:
	@echo "\n=== Lambda Functions ==="
	aws lambda list-functions --region ${AWS_DEFAULT_REGION} | jq '.'

all-lambdas:
	@echo "\n=== Lambda Functions with Details ==="
	aws lambda list-functions --region ${AWS_DEFAULT_REGION} | jq '.Functions | map({name: .FunctionName, runtime: .Runtime, handler: .Handler, lastModified: .LastModified})'
	@echo "\n=== Lambda Function URLs ==="
	for fn in $$(aws lambda list-functions --query 'Functions[*].FunctionName' --output text --region ${AWS_DEFAULT_REGION}); do \
		echo "\nURLs for function: $$fn"; \
		aws lambda get-function-url-config --function-name $$fn --region ${AWS_DEFAULT_REGION} | jq '.' 2>/dev/null || echo "No URL config found"; \
	done
	@echo "\n=== Lambda Layers ==="
	aws lambda list-layers --region ${AWS_DEFAULT_REGION} | jq '.'
	@echo "\n=== Lambda Event Source Mappings ==="
	aws lambda list-event-source-mappings --region ${AWS_DEFAULT_REGION} | jq '.'

# DynamoDB Discovery
dynamo-ls:
	@echo "\n=== DynamoDB Tables ==="
	aws dynamodb list-tables --region ${AWS_DEFAULT_REGION} | jq '.'

dynamo-inspect:
	@echo "\n=== DynamoDB Table Details ==="
	for table in $$(aws dynamodb list-tables --region ${AWS_DEFAULT_REGION} --query 'TableNames[]' --output text); do \
		echo "\nTable: $$table"; \
		aws dynamodb describe-table --table-name $$table --region ${AWS_DEFAULT_REGION} | jq '.Table | {TableName, ItemCount, TableStatus, ProvisionedThroughput}'; \
	done

all-dynamo:
	@echo "\n=== Full DynamoDB Information ==="
	@echo "\nListing Tables..."
	aws dynamodb list-tables --region ${AWS_DEFAULT_REGION} | jq '.'
	@echo "\nTable Details:"
	for table in $$(aws dynamodb list-tables --region ${AWS_DEFAULT_REGION} --query 'TableNames[]' --output text); do \
		echo "\nTable: $$table"; \
		aws dynamodb describe-table --table-name $$table --region ${AWS_DEFAULT_REGION} | jq '.'; \
		echo "\nGSIs for $$table:"; \
		aws dynamodb describe-table --table-name $$table --region ${AWS_DEFAULT_REGION} | jq '.Table.GlobalSecondaryIndexes // empty'; \
		echo "\nSample Items from $$table:"; \
		aws dynamodb scan --table-name $$table --limit 3 --region ${AWS_DEFAULT_REGION} | jq '.Items'; \
	done

# NFL Specific DynamoDB Operations
nfl-tables:
	@echo "\n=== NFL-Related DynamoDB Tables ==="
	aws dynamodb list-tables --region ${AWS_DEFAULT_REGION} | jq '.TableNames[] | select(contains("NFL") or contains("nfl") or contains("player") or contains("Player"))'

nfl-player-scan:
	@echo "\n=== NFL Player Table Scan ==="
	aws dynamodb scan \
		--table-name "NflPlayerTable" \
		--region ${AWS_DEFAULT_REGION} \
		--limit 5 | jq '.'

nfl-player-count:
	@echo "\n=== NFL Player Count ==="
	aws dynamodb describe-table \
		--table-name "NflPlayerTable" \
		--region ${AWS_DEFAULT_REGION} | jq '.Table.ItemCount'

# QuickSight specific since we found the embedding API
qs-ls:
	@echo "\n=== QuickSight Resources ==="
	@echo "\nDashboards:"
	aws quicksight list-dashboards --aws-account-id ${AWS_ACCOUNT_ID} --region ${AWS_DEFAULT_REGION} | jq '.'
	@echo "\nDatasets:"
	aws quicksight list-data-sets --aws-account-id ${AWS_ACCOUNT_ID} --region ${AWS_DEFAULT_REGION} | jq '.'
	@echo "\nAnalyses:"
	aws quicksight list-analyses --aws-account-id ${AWS_ACCOUNT_ID} --region ${AWS_DEFAULT_REGION} | jq '.'

# Combined Discovery
all: api-ls lambda-ls dynamo-ls qs-ls
	@echo "\n=== Discovery Complete ==="

# Development Setup
dev-setup:
	@echo "\n=== Setting up development environment ==="
	npm install
	chmod +x build.sh
	./build.sh
