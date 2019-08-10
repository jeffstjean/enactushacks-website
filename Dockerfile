FROM node:10-alpine

WORKDIR /app/scr

COPY src/package*.json ./

USER root

RUN npm install

COPY ./src .

EXPOSE 8080

CMD ./wait-for.sh db:${MONGO_PORT} && npm run prod
