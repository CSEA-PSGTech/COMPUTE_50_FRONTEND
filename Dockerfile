FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_BASE_PATH=/compute50/
ARG VITE_API_BASE_URL=https://kriyabackend.psgtech.ac.in/inf
ARG VITE_HACKATHON_EVENT_ID=EVNT01
ARG VITE_REQUIRE_GENERAL_FEE=true
ARG VITE_PAYMENT_PORTAL_URL=
ARG VITE_PARTICIPANT_WHATSAPP_URL=
ARG VITE_PROFILE_EDIT=false
ARG VITE_SEND_BEARER=false
ARG VITE_PAYMENT_EVENT_KEY=compute50

ENV VITE_BASE_PATH=$VITE_BASE_PATH \
    VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_HACKATHON_EVENT_ID=$VITE_HACKATHON_EVENT_ID \
    VITE_REQUIRE_GENERAL_FEE=$VITE_REQUIRE_GENERAL_FEE \
    VITE_PAYMENT_PORTAL_URL=$VITE_PAYMENT_PORTAL_URL \
    VITE_PARTICIPANT_WHATSAPP_URL=$VITE_PARTICIPANT_WHATSAPP_URL \
    VITE_PROFILE_EDIT=$VITE_PROFILE_EDIT \
    VITE_SEND_BEARER=$VITE_SEND_BEARER \
    VITE_PAYMENT_EVENT_KEY=$VITE_PAYMENT_EVENT_KEY

RUN npm run build

FROM nginx:1.27-alpine
ARG VITE_BASE_PATH=/compute50/
COPY nginx.conf /tmp/nginx.conf
RUN BASE="/$(echo "$VITE_BASE_PATH" | sed -e 's#^/*##' -e 's#/*$##')/" \
 && BASE="$(echo "$BASE" | sed 's#^//$#/#')" \
 && sed "s#__BASE__#${BASE}#g" /tmp/nginx.conf > /etc/nginx/conf.d/default.conf \
 && if [ "$BASE" = "/" ]; then sed -i '/location = \/ {/,/}/d' /etc/nginx/conf.d/default.conf; fi \
 && mkdir -p "/usr/share/nginx/html${BASE}" \
 && echo "$BASE" > /tmp/base
COPY --from=build /app/dist /tmp/dist
RUN cp -r /tmp/dist/. "/usr/share/nginx/html$(cat /tmp/base)" && rm -rf /tmp/dist
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1