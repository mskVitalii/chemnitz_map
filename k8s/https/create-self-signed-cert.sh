#!/bin/bash

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -config openssl.cnf -extensions req_ext


kubectl delete secret chemnitz-map-tls

kubectl create secret tls chemnitz-map-tls --key tls.key --cert tls.crt

kubectl rollout restart deployment ingress-nginx-controller -n ingress-nginx