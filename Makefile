.PHONY: init pull dev run

init:
	bash ./server/resources/init_gitlab_access_token.sh
	bash ./server/resources/fetch_env_variables.sh

pull:
	git pull
	bash ./server/resources/fetch_env_variables.sh

dev:
	cd client && npm i && npm run dev &
	cd server && docker compose up -d --build

run:
	cd client && docker compose up -d
	cd server && docker compose up -d