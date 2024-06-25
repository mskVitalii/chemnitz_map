# DWT Chemnitz map

---

## Ignition
```shell
# start
docker compose up -d

# development
docker compose watch
```

## Infra

Local: [Swagger](http://localhost:80/swagger/index.html)

```shell
sh ./resources/swagger.sh
```

And then go to docs.go to delete

	LeftDelim:        "{{",
	RightDelim:       "}}",

---
### internal

* controller - http/v1
* adapters - databases & other services
* model - all entities

### pkg

Common between programs (microservices)

* clients - db clients
* config - configuration (app.yaml + .env)

## Инструменты

* gin - routing

---
## Deployment steps

1. [docker](https://docs.docker.com/engine/install/ubuntu/)

2. [docker compose plugin](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-22-04)

3. [SSH github](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

4. [GitHub actions runner](https://habr.com/ru/articles/737148/)