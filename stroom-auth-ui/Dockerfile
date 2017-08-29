
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
COPY .env.production .env.production
RUN yarn build


# ---- Release ----
FROM base AS release
# This path is where the app is mounted in the image
RUN mkdir /root/app/auth
COPY --from=build /root/app/build/. ./auth
EXPOSE 5000
CMD serve --single --cors .