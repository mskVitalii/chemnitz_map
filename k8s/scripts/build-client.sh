#!/bin/bash

cd ../../client &&
docker build -t mskkote/chemnitz-map-client . && docker push mskkote/chemnitz-map-client &&
kubectl rollout restart deployment chemnitz-map-client
