# DWT Chemnitz map

---

* [Russian article about project on Habr](https://habr.com/ru/articles/826508/)
* [English article about project on Medium](https://medium.com/@msk.vitalii/from-firebase-to-self-hosted-4ddb01c539e1)

## Ignition
```shell
# start
docker compose up -d

# development
docker compose watch
```

For K8S add 


## Infra

[Local Swagger](http://localhost:8080/swagger/index.html)

Generation of the swagger. It's setup IDE to run this script before start
```shell
sh ./resources/swagger.sh
```

Other infrastructure runs on Docker

---
### internal

* controller - http/v1
* service - request handlers
* adapters - databases & other services
* model - all entities
* utils - common logic for the services

### pkg

Common between programs (microservices)

* clients - db clients
* google - auth
* telemetry - logs, tracing, metrics, profiling
* config - configuration (app.yaml + .env)

---
## Deployment steps

1. Install Docker, K8S and Minikube
2. Start Docker Engine and Minikube
3. `minikube addons enable ingress`
4. Run `minikube dashboard` in the separate console
5. Add `127.0.0.1 grafana.local pyroscope.local jaeger.local prometheus.local loki.local mongo.local chemnitz-map.local api.chemnitz-map.local` to `/etc/hosts`
6. Apply scripts `create-k8s-*`
7. Apply manifests from folder /k8s
8. For https create self-signed cert and trust it OR apply manifest for Let's Encrypt (additional steps required) 