#!/bin/sh

yarn
mv .env.prod .env.local
yarn build
screen -X -S web quit
screen -X -S scoring quit
screen -dmS web -L -Logfile /tmp/web-$(date +%x-%X).log yarn start
screen -dmS scoring -L -Logfile /tmp/score-$(date +%x-%X).log node admin/scoring.js
