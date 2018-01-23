#!/bin/sh

./config.template.sh prod
yarn build

# Everything is served from /auth. Nothing can be visible from root. 
# So we need to move the statics and re-write the references
mv build/static build/auth/static
sed -i 's/\/static/\/auth\/static/g' build/index.html


serve -s build