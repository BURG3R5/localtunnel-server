FROM node:18.12.1-alpine

WORKDIR /app

COPY package.json /app/

RUN npm install --production

COPY . /app

ENTRYPOINT ["node", "--experimental-modules", "./bin/server.mjs"]
