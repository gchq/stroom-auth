#!/bin/sh

./config.template.sh dev
yarn build
mv build/static build/auth/static
serve -s build