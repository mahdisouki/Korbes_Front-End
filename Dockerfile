# Dokploy: use this Dockerfile and expose container port 80.
# /api on the site is forwarded to the public API below.
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

ENV API_UPSTREAM=https://sttkapi.duckdns.org
ENV API_HOST=sttkapi.duckdns.org

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
