#!/bin/sh

yarn
mv .env.prod .env.local
yarn build
screen -X -S web quit
screen -X -S scoring quit
screen -dmS web -L -Logfile /var/log/jul/web-$(date +%d-%X).log yarn start
screen -dmS scoring -L -Logfile /var/log/jul/score-$(date +%d-%X).log node admin/scoring.js
screen -dmS grinch -L -Logfile /var/log/jul/grinch-$(date +%d-%X).log node admin/grinch.js
