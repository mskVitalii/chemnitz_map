#!/bin/bash

kubectl create configmap grafana-dashboards --from-file=dashboards.yaml=./dashboards.yaml

kubectl create configmap grafana-config --from-file=grafana.yml=../../server/resources/grafana.yml

kubectl create configmap grafana-dashboard --from-file=dashboard.json=../../server/resources/grafana-provisioning/dashboards/dashboard.json
