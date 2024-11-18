FROM node:18-alpine as builder

COPY package.json /tmp/package.json
RUN cd /tmp && yarn install --ignore-engines
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app/

WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY . /usr/src/app
RUN yarn build
ENV NODE_ENV production
ENV PORT 4321
EXPOSE 4321

CMD ["npm", "start"]