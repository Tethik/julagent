#!/bin/sh

yarn
mv .env.prod .env.local
yarn build
screen -dmS web yarn start