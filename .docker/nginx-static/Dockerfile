FROM nginx:alpine

LABEL maintainer="ambroise@rezo-zero.com"
LABEL "traefik.enable"="true"

COPY dist/ /usr/share/nginx/html
COPY .docker/nginx/custom-nginx.conf /etc/nginx/nginx.conf
COPY .docker/nginx-static/default.conf /etc/nginx/conf.d/default.conf

