#!/bin/bash

cd ../../server &&
docker build -t mskkote/chemnitz-map-server . && docker push mskkote/chemnitz-map-server &&
kubectl rollout restart deployment chemnitz-map-server
