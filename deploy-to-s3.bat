@echo off
REM Deployment script for AWS S3

REM Set your S3 bucket name
set BUCKET_NAME=zucoinvoiceapp

REM Sync local files to the S3 bucket
aws s3 sync . s3://%BUCKET_NAME% --exclude ".git/*" --exclude "node_modules/*"

echo Deployment completed.
pause
