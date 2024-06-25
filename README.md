# Chemnitz map

## Members

- Frontend: [Anastasiia Zibrova](https://www.linkedin.com/in/anzania/)
- Backend: [Popov Vitalii](https://linktr.ee/mskVitalii)


## How to run the project?

### Prerequisites
1. npm
2. bash
3. docker & docker compose
4. Gitlab Access Token with Maintainer role

### Ignition

```bash
make init && make run
```

--- 
All commands via `make <command>`:

#### `init`
- Runs a script to initialize the GitLab access token (`7xg8p8payzDFuMYRxTit`).
- Fetches environment variables.
- Installs npm dependencies.

#### `pull`
- Pulls the latest changes from the Git repository.
- Fetches environment variables.

#### `dev`
- Starts frontend.
- Starts Docker containers in detached mode with `--build` flag.

#### `run`
- Starts frontend.
- Starts Docker containers in detached mode.

---

## Links

- [Frontend](http://localhost:3000)
- [Swagger](http://localhost:80/swagger/index.html)
- [Grafana & Loki](http://localhost:3030)
- [Prometheus](http://localhost:9090/)
- [Jaeger](http://localhost:16686/)
- [Pyroscope](http://localhost:4040/)

Mongo inits with the server