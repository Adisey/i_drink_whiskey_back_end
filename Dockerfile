FROM node:12-alpine3.14

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/

RUN yarn install

COPY ./*.* /usr/src/app/
COPY ./src /usr/src/app/src

RUN ./node_modules/.bin/nest build

EXPOSE 4000

CMD ["node", "dist/main.js"]