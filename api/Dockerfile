FROM node:10-alpine

WORKDIR /home/node/app

COPY package*.json ./

USER root

# If you are building your code for production add --only=production
RUN npm install

COPY . .

HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD node ./healthcheck.js

EXPOSE 5000

CMD node server.js