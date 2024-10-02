FROM node:20-alpine3.20

# Add libvips for IPX support nuxt/image on Alpine
RUN apk add --upgrade --no-cache vips-dev build-base curl && \
    # create destination directory
    mkdir -p /usr/src/nuxt-app

WORKDIR /usr/src/nuxt-app

HEALTHCHECK --start-period=1m30s --interval=1m --timeout=6s CMD curl --fail -I http://localhost:3000

# copy the app as "node" user, note .dockerignore
COPY --chown=node:node .output /usr/src/nuxt-app/.output
# set app serving to permissive / assigned
ENV HOST=0.0.0.0
# set app port
ENV PORT=3000
ENV NODE_ENV=production
ENV NITRO_PRESET=node_cluster
EXPOSE 3000

# Always run app as a non-root user for security matter
# Official node images create a "node" user
# @see https://github.com/nodejs/docker-node/blob/main/Dockerfile-alpine.template#L6
USER node

# start the app
CMD [ "node", ".output/server/index.mjs" ]

