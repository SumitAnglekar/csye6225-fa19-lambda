# CSYE 6225 - Fall 2019 - Lambda Function

## Team Information

| Name | NEU ID | Email Address |
| --- | --- | --- |
| Ishita Sequeira| 001403357 | sequeira.i@husky.neu.edu |
| Tejas Shah | 001449694 | shah.te@husky.neu.edu |
| Sumit Anglekar | 001475969 | anglekar.s@husky.neu.edu |

## Technology Stack
1. NodeJs

## CI/CD
1. Create policy for circleci IAM user to give access to create new AMI: 
    `terraform plan -target module.application.aws_iam_user_policy_attachment.circleci_ec2_policy_attach -out run.plan`
    `terraform apply run.plan`
2. Trigger the circleci plan to build new AMI:
    `curl -u <CIRCLECI_TOKEN>: -d build_parameters[CIRCLE_JOB]=build https://circleci.com/api/v1.1/project/github/<ORGANIZATION>/csye6225-fall2019-ami/tree/<BRANCH>`
3. Once the build is completed a new AMI will be created and registered with AWS.
4. Create the remaining infrastructure using `terraform apply`.
5. Once successful, a new EC2 instance would be up and running.
6. Trigger the circleci build to deploy new version of the app:
    `curl -u <CIRCLECI_TOKEN>: -d build_parameters[CIRCLE_JOB]=build https://circleci.com/api/v1.1/project/github/<ORGANIZATION>/ccwebapp/tree/<BRANCH>`
7. The build should complete sucessfully deploying the application to the EC2 instance and also uploading the latest artifact in the S3 bucket.
8. Trigger the circleci build to update the new version of lambda function:
    `curl -u <CIRCLECI_TOKEN>: -d build_parameters[CIRCLE_JOB]=build https://circleci.com/api/v1.1/project/github/<ORGANIZATION>/csye6225-fa19-lambda/tree/<BRANCH>`
9. The build should complete sucessfully updating the lambda function and also uploading the latest artifact in the S3 bucket.

## Application Endpoints to access lambda function
1. Get all your recipes over email (https://{domain_name}/v1/myrecipes)
