FROM node:12-alpine3.14

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/

RUN yarn install

COPY ./*.* /usr/src/app/
COPY ./src /usr/src/app/src

RUN ./node_modules/.bin/nest build

# clean all depencies
RUN rm -rf src
RUN rm -rf node_modules
RUN yarn cache clean

# install production dependencies only
RUN yarn install --production

EXPOSE 4000

CMD ["node", "dist/main.js"]