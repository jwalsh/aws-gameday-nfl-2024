# Check resources in each stack
for stack in $(aws cloudformation list-stacks --query 'StackSummaries[?StackStatus==`CREATE_COMPLETE`].StackName' --output text --region us-west-2); do
  echo "=== Resources in $stack ==="
  aws cloudformation list-stack-resources --stack-name $stack --region us-west-2 | jq '.StackResourceSummaries[].LogicalResourceId'
done
