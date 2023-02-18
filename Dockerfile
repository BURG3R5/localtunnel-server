FROM node:10.1.0-alpine

WORKDIR /app

COPY package.json /app/

RUN npm install --production

COPY . /app

ENTRYPOINT ["node", "-r", "esm", "./bin/server"]
