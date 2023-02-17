FROM node:10.1.0-alpine

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/

RUN npm install --production && npm cache clean

COPY . /app

ENV NODE_ENV production
ENTRYPOINT ["node", "-r", "esm", "./bin/server"]
