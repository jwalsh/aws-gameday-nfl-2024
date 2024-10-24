# Test the players endpoint
curl -X POST \
  'https://xg3nongk71.execute-api.us-west-2.amazonaws.com/prod/players' \
  -H 'Content-Type: application/json' \
  -d '{
    "TableName": "NflPlayerTable",
    "Select": "ALL_ATTRIBUTES"
  }'

# Test a single player
curl -X POST \
  'https://xg3nongk71.execute-api.us-west-2.amazonaws.com/prod/player' \
  -H 'Content-Type: application/json' \
  -d '{
    "TableName": "NflPlayerTable",
    "Key": {
      "pk": "46263"
    }
  }'
