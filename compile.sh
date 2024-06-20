#!/usr/bin/env bash
rm -rf ./dist ./node_modules &&
yarn &&
./node_modules/.bin/sass assets/scss/screen.scss > ./assets/css/screen.css &&
yarn run zip
echo "You can find the final theme under ./dist/the-shell-fork.zip"