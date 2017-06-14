
# ---- Base Node ----
FROM alpine:3.5 AS base
RUN apk add --no-cache nodejs-current tini
WORKDIR /root/app
# Set tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]

# ---- Dependencies ----
FROM base AS dependencies
COPY package.json package.json
RUN npm install


# ---- Build ----
FROM dependencies AS build
COPY --from=dependencies /root/app/node_modules /root/app/node_modules
COPY src src
COPY public public
COPY .env.production .env.production
RUN npm run build


# ---- Release ----
FROM base AS release
RUN npm install -g serve
COPY --from=build /root/app/build/. .
EXPOSE 5000
CMD serve -s .