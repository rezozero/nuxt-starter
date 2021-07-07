FROM nginx:alpine

LABEL maintainer="ambroise@rezo-zero.com"
LABEL "traefik.enable"="true"
LABEL "traefik.http.services.art-grandest.loadbalancer.server.scheme"="http"
LABEL "traefik.http.services.art-grandest.loadbalancer.server.port"="80"
LABEL "traefik.http.services.art-grandest.loadbalancer.passhostheader"="true"

RUN mkdir -p /usr/share/nginx/app
COPY .nuxt/dist/client /usr/share/nginx/app
COPY .docker/nginx/custom-nginx.conf /etc/nginx/nginx.conf
COPY .docker/nginx/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/app
