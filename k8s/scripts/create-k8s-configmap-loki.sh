#!/bin/bash

kubectl create configmap loki-config --from-file=loki-config.yaml=../../server/resources/loki-config.yaml
