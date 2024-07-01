#!/bin/bash

ENV_FILE="../../server/.env.production"
SECRET_NAME="chemnitz-map"

kubectl delete -n default secret chemnitz-map

kubectl create secret generic "$SECRET_NAME" --from-env-file="$ENV_FILE" --save-config