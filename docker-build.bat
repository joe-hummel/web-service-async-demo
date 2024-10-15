@echo off
REM
REM Windows BATCH script to build docker container
REM
@echo on
docker rmi web-service-async-demo
docker build -t web-service-async-demo .
