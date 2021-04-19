FROM node:14-alpine

WORKDIR /graphql

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]