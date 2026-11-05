FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_BASE_PATH=/compute50/
ENV VITE_BASE_PATH=$VITE_BASE_PATH

RUN npm run build

FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=builder /app/dist ./

RUN mkdir -p /etc/nginx/snippets
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/40-env-config.sh /docker-entrypoint.d/40-env-config.sh
RUN sed -i 's/\r$//' /docker-entrypoint.d/40-env-config.sh && chmod +x /docker-entrypoint.d/40-env-config.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]