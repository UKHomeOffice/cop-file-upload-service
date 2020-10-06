FROM node:11-alpine as base

ENV USER node
ENV GROUP node
ENV HOME /usr/src/app
ENV NPM_PACKAGES=${HOME}/npm-packages
ENV PATH ${HOME}/bin:${NPM_PACKAGES}/bin:$HOME/yarn-v$YARN_VERSION/bin:$PATH
ENV NODE_PATH $NPM_PACKAGES/lib/node_modules:$NODE_PATH

RUN set -eux; \
  apk update; \
  apk add --no-cache \
  bash \
  tesseract-ocr \
  graphicsmagick \
  ghostscript \
  rm -rf /var/cache/apk/* ; \
  addgroup "$GROUP" -g 1000 && adduser -u 1000 -S -s /bin/false -h "$HOME" -G "$GROUP" "$USER" ; \
  mkdir -p /app /drone "$HOME"; \
  chown -R "$USER":"$GROUP" /app /drone "$HOME" 

WORKDIR "${HOME}"


FROM base as build
ADD . "${HOME}"

RUN set -eux ;\
    chown -R "$USER":"$GROUP" "$HOME" ; \
    npm ci ; \
    npm run build ; \
    npm cache verify


FROM build as fileupload
USER 1000
EXPOSE 8181
CMD [ "npm", "start" ]

