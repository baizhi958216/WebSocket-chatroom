# Stage 1: build
FROM node:16 AS development

WORKDIR /baizhi958216/frontend/src/app

COPY package*.json ./

RUN npm install -g yarn --force
RUN yarn global add @angular/cli

COPY . .

RUN yarn build

EXPOSE 4200