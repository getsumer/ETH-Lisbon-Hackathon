FROM node:latest

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn
COPY . .
EXPOSE 3002
RUN yarn build

CMD [ "yarn", "start", "-p", "3002" ]
