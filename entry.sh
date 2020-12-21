#!/bin/sh

yarn
mv .env.prod .env.local
yarn build
screen -X -S web quit
screen -dmS web yarn start