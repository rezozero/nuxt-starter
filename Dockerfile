ARG NODE_VERSION=22.13.1
ARG NGINX_VERSION=1.27.2
ARG UID=1000

#############
# Node      #
#############

FROM node:${NODE_VERSION}-bookworm-slim AS node

LABEL org.opencontainers.image.authors="ambroise@rezo-zero.com"

ARG UID

# Fix: "FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory"
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Prevent Corepack pnpm download confirm prompt
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

SHELL ["/bin/bash", "-e", "-o", "pipefail", "-c"]

RUN <<EOF
apt-get --quiet update
apt-get --quiet --yes --purge --autoremove upgrade
# Packages - System
apt-get --quiet --yes --no-install-recommends --verbose-versions install \
    curl \
    less \
    sudo
rm -rf /var/lib/apt/lists/*

# User
groupmod --gid ${UID} node
usermod --uid ${UID} node
chown --verbose --recursive ${UID}:${UID} /home/node
echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node

# https://github.com/pnpm/pnpm/issues/9029
npm i -g corepack@latest

# App
install --verbose --owner node --group node --mode 0755 --directory /app

# Pnpm
corepack enable pnpm
EOF

WORKDIR /app

#######################
# Node - Prod - Build #
#######################

FROM node AS node-prod-build

ENV NITRO_PRESET=node_server
# Use the cluster preset to run the app with multiple workers
# There is an issue in Nitro 2.10.4
#ENV NITRO_PRESET=node_cluster

USER node

# Make sure to copy pnpm-lock.yaml .npmrc to stick to the same versions
# and avoid any issues with the versions of the dependencies
COPY --link --chown=${UID}:${UID} package.json pnpm-lock.yaml .npmrc ./
# Install dependencies
RUN pnpm install --frozen-lockfile

COPY --link --chown=${UID}:${UID} . .

RUN pnpm build

##############################
# Node - Maintenance - Build #
##############################

FROM node AS node-maintenance-build

USER node

# Make sure to copy pnpm-lock.yaml .npmrc to stick to the same versions
# and avoid any issues with the versions of the dependencies
COPY --link --chown=${UID}:${UID} package.json pnpm-lock.yaml .npmrc ./
# Install dependencies
RUN pnpm install --frozen-lockfile

COPY --link --chown=${UID}:${UID} . .

RUN pnpm generate:maintenance

###############
# Node - DEV  #
###############

FROM node AS node-dev

ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

USER node

# In development, we need to expose the port 3000 and declare a volume on app folder
VOLUME /app

CMD ["pnpm", "dev"]

###############
# Node - Prod #
###############

FROM node AS node-prod

ENV NITRO_PORT=3000
ENV NODE_ENV=production

ENV NITRO_PRESET=node_server
# Use the cluster preset to run the app with multiple workers
# There is an issue in Nitro 2.10.4
#ENV NITRO_PRESET=node_cluster
#ENV NITRO_CLUSTER_WORKERS=3

USER node

COPY --link --from=node-prod-build --chown=${UID}:${UID} /app/.output .

CMD ["node", "server/index.mjs"]

#########
# Nginx #
#########

FROM nginx:${NGINX_VERSION}-bookworm AS nginx

LABEL org.opencontainers.image.authors="ambroise@rezo-zero.com"

ARG UID

SHELL ["/bin/bash", "-e", "-o", "pipefail", "-c"]

RUN <<EOF
# Packages
apt-get --quiet update
apt-get --quiet --yes --purge --autoremove upgrade
apt-get --quiet --yes --no-install-recommends --verbose-versions install \
    less \
    sudo
rm -rf /var/lib/apt/lists/*

# User
groupmod --gid ${UID} nginx
usermod --uid ${UID} nginx
echo "nginx ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/nginx

# App
install --verbose --owner nginx --group nginx --mode 0755 --directory /app
EOF

WORKDIR /app

#########
# Nginx #
#########

FROM nginx AS nginx-prod

# Silence entrypoint logs
ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

# Config
COPY --link docker/nginx/nginx.conf               /etc/nginx/nginx.conf
COPY --link docker/nginx/redirections.conf        /etc/nginx/redirections.conf
COPY --link docker/nginx/mime.types               /etc/nginx/mime.types
COPY --link docker/nginx/conf.d/_gzip.conf        /etc/nginx/conf.d/_gzip.conf
COPY --link docker/nginx/conf.d/_security.conf    /etc/nginx/conf.d/_security.conf
COPY --link docker/nginx/conf.d/default.prod.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --start-period=1m30s --interval=1m --timeout=6s CMD curl --fail -I http://localhost

COPY --link --from=node-prod-build --chown=${UID}:${UID} /app/.output/public /app/public

#######################
# Nginx - Maintenance #
#######################

FROM nginx AS nginx-maintenance

# Silence entrypoint logs
ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

# Config
COPY --link docker/nginx/nginx.conf                   /etc/nginx/nginx.conf
COPY --link docker/nginx/redirections.conf            /etc/nginx/redirections.conf
COPY --link docker/nginx/mime.types                   /etc/nginx/mime.types
COPY --link docker/nginx/conf.d/_gzip.conf            /etc/nginx/conf.d/_gzip.conf
COPY --link docker/nginx/conf.d/_security.conf        /etc/nginx/conf.d/_security.conf
COPY --link docker/nginx/conf.d/maintenance.prod.conf /etc/nginx/conf.d/default.conf

# Copy Nuxt static files and rename maintenance to root page
COPY --link --from=node-maintenance-build --chown=${UID}:${UID} /app/.output/public /app/public

RUN mv /app/public/maintenance.html /app/public/index.html
