FROM varnish:6.3

LABEL maintainer="ambroise@rezo-zero.com"
LABEL "traefik.enable"="true"

ENV VARNISH_SIZE 2G

COPY .docker/varnish/default.vcl /etc/varnish/default.vcl

