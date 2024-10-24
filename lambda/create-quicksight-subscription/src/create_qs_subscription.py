import os
import time

import boto3
import cfn_response

EMAIL = "nflanalytics@example.com"
USERNAME = "nfl_analytics"

region_name = os.environ["AWS_REGION"]
quicksight = boto3.client("quicksight", region_name=region_name)


def subscribe(account_id):
    try:
        response = quicksight.create_account_subscription(
            Edition="ENTERPRISE_AND_Q",
            AuthenticationMethod="IAM_AND_QUICKSIGHT",
            AwsAccountId=account_id,
            AccountName=account_id,
            NotificationEmail=EMAIL,
            FirstName="NFL",
            LastName="AWS",
            EmailAddress=EMAIL,
            ContactNumber="1234567890",
        )
        print("create_account_subscription response: ", str(response))
    except quicksight.exceptions.ResourceExistsException:
        print("Already subscribed")
        return

    try:
        # poll subscription status
        for _ in range(720):
            response = quicksight.describe_account_subscription(AwsAccountId=account_id)
            print("describe_account_subscription response: ", str(response))
            if response.get("AccountInfo", {}).get("AccountSubscriptionStatus") in (
                "ACCOUNT_CREATED",
                "UNSUBSCRIBE_FAILED",
            ):
                break
            time.sleep(1)
        else:
            raise Exception("Timeout while waiting for subscription to complete")

    except Exception as exc:
        print("Unable to create qs and setup user:", exc)
        raise exc


def unsubscribe(account_id):
    try:
        print("removing delete protection")
        quicksight.update_account_settings(
            AwsAccountId=account_id,
            DefaultNamespace="default",
            TerminationProtectionEnabled=False,
        )
        print("deleting")
        quicksight.delete_account_subscription(
            AwsAccountId=account_id,
        )
        return
    except quicksight.exceptions.PreconditionNotMetException:
        print("Subscription already deleting")
        return
    except quicksight.exceptions.ResourceNotFoundException:
        print("Subscription already deleted or does not exist")
        return
    except Exception as exc:
        print("Unable to delete qs:", exc)
        raise exc


def lambda_handler(event, context):
    print(event)
    account_id = context.invoked_function_arn.split(":")[4]
    request_type = event["RequestType"]
    try:
        if request_type == "Create":
            print("Create request received, importing data")
            subscribe(account_id)
            cfn_response.send(event, context, cfn_response.SUCCESS, {})
        else: 
            # delete is disabled as it could cause unexpected QS account frozen.
            # unsubscribe(account_id)
            cfn_response.send(event, context, cfn_response.SUCCESS, {})
    except Exception as e:
        print(f"Failed to process with error: {e}")
        cfn_response.send(event, context, cfn_response.FAILED, {})


if __name__ == "__main__":
    subscribe("441062728851")
    # unsubscribe("441062728851")
