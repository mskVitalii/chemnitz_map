#!/bin/bash

kubectl create configmap prometheus-config --from-file=prometheus.yml=../../server/resources/prometheus.yml
