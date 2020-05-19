# ------------
# build image
# ------------
FROM node:current-alpine as build-env

WORKDIR /build
COPY package.json \
     package-lock.json \
     /build/
RUN npm install
COPY . /build

# -----------
# clean image
# -----------
FROM node:current-alpine AS clean-env
WORKDIR /build
COPY --from=build-env /build/ /build
RUN npm prune --production \
    && rm -rf test/

# -----------------
# production image
# -----------------
FROM node:current-alpine
WORKDIR /app

LABEL maintainer="Clément Désiles <main@jokester.fr>" \
      description="a Node.js boilerplate project"

COPY --from=clean-env /build/ /app

ENV NODE_ENV="production" \
    PORT="8080"

USER node
EXPOSE 8080
ENTRYPOINT ["npm"]
CMD ["start"]
