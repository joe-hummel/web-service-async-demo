#!/bin/bash
#
# Linux/Mac BASH script to build docker container
#
docker rmi web-service-async-demo
docker build -t web-service-async-demo .
