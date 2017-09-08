
# ---- Base Node ----
FROM alpine:3.6 AS base
RUN apk add --no-cache nodejs-current yarn tini
RUN yarn global add serve
WORKDIR /root/app
# Set tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]

# ---- Dependencies ----
FROM base AS dependencies
COPY package.json package.json
RUN yarn install


# ---- Build ----
FROM dependencies AS build
COPY --from=dependencies /root/app/node_modules /root/app/node_modules
COPY src src
COPY public public
EXPOSE 5000
CMD yarn build && serve --single --cors ./build