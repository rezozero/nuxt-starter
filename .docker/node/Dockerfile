FROM node:14-alpine

# create destination directory
RUN mkdir -p /usr/src/nuxt-app && \
    apk add curl
WORKDIR /usr/src/nuxt-app

# copy the app, note .dockerignore
COPY . /usr/src/nuxt-app
# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=5000
# expose 5000 on container
EXPOSE 5000
# start the app
CMD [ "yarn", "start" ]

