FROM node:18.12.1-alpine

WORKDIR /app

COPY package.json /app/

RUN npm install --production

COPY . /app

ENTRYPOINT ["node", "-r", "esm", "./bin/server"]
