#!/bin/sh

yarn
mv .env.prod .env.local
yarn build
screen -X -S web quit
screen -dmS web -L -Logfile /tmp/web-$(date +%x-%X).log yarn start