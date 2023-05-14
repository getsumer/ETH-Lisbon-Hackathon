FROM node:latest

WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN yarn
EXPOSE 3002
RUN yarn build

CMD [ "yarn", "start", "-p", "3002" ]
