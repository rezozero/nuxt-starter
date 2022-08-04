FROM nginx:alpine

LABEL maintainer="ambroise@rezo-zero.com"

RUN mkdir -p /usr/share/nginx/app/_nuxt
COPY .nuxt/dist/client /usr/share/nginx/app/_nuxt
COPY .docker/nginx/custom-nginx.conf /etc/nginx/nginx.conf
COPY .docker/nginx/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/app
