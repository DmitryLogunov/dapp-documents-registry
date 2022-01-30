FROM node:14-alpine as base

WORKDIR /app
COPY ./ ./

RUN apk --no-cache add git bash && rm -rf /var/cache/apk/*

RUN yarn
