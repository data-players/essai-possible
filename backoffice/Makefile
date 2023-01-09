local= docker-compose -f docker-compose-local.yaml
prod= docker-compose

build:
	$(prod) build --no-cache

build-local:
	$(local) build --no-cache

build-dockerhub:
	docker-compose -f docker-compose-dockerhub.yaml build

start: 
	$(prod) up -d

stop: 
	$(prod) down

logs:
	$(prod) logs -f

logs-local:
	$(local) logs -f

start-local: 
	$(local) up -d

stop-local: 
	$(local) down

set-compact-cron: 
	(crontab -l 2>/dev/null; echo "0 4 * * * $(path-cron) >> /tmp/cronlog.txt") | crontab -

prune-data:
	sudo rm -rf ./data