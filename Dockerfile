FROM node:10

WORKDIR /app
ADD . /app
RUN npm install && npm run tsc

CMD [ "node", "dist/server.js" ]
