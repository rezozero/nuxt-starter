ARG NODE_VERSION=20.18.0
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

ENV NITRO_PRESET=node_cluster

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
# Node - Prod #
###############

FROM node AS node-prod

ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
ENV NODE_ENV=production
ENV NITRO_CLUSTER_WORKERS=2

HEALTHCHECK --start-period=1m30s --interval=1m --timeout=6s CMD curl --fail -I http://localhost:3000

USER node

COPY --link --from=node-prod-build --chown=${UID}:${UID} /app/.output .

CMD ["node", "server/index.mjs"]

#########
# Nginx #
#########

FROM roadiz/nginx-alpine AS nginx-prod

LABEL org.opencontainers.image.authors="ambroise@rezo-zero.com"

COPY --link docker/nginx/conf.d /etc/nginx/conf.d
COPY --link docker/nginx/nuxt_ip_filter.conf /etc/nginx/nuxt_ip_filter.conf
COPY --link docker/nginx/redirections.conf /etc/nginx/redirections.conf

HEALTHCHECK --start-period=1m30s --interval=1m --timeout=6s CMD curl --fail -I http://localhost

# Nginx user is 1000
COPY --link --from=node-prod-build --chown=1000:1000 /app/.output/public /var/www/html/public

#######################
# Nginx - Maintenance #
#######################

FROM nginx:alpine AS nginx-maintenance

LABEL org.opencontainers.image.authors="ambroise@rezo-zero.com"

# Copy Nuxt static files and rename maintenance to root page
COPY --link --from=node-maintenance-build --chown=nginx:nginx /app/.output/public /usr/share/nginx/html

RUN mv /usr/share/nginx/html/maintenance.html /usr/share/nginx/html/index.html
