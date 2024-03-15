FROM node:20-alpine

# Add libvips for IPX support nuxt/image on Alpine
RUN apk add --upgrade --no-cache vips-dev build-base --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community/

# create destination directory
RUN mkdir -p /usr/src/nuxt-app && \
    apk add curl
WORKDIR /usr/src/nuxt-app

HEALTHCHECK --start-period=1m30s --interval=1m --timeout=6s CMD curl --fail -I http://localhost:3000

# copy the app, note .dockerignore
COPY .output /usr/src/nuxt-app/.output
# set app serving to permissive / assigned
ENV HOST=0.0.0.0
# set app port
ENV PORT=3000
ENV NODE_ENV=production
ENV NITRO_PRESET=node_cluster
# expose 5000 on container
EXPOSE 3000
# start the app
CMD [ "node", ".output/server/index.mjs" ]

