# Stage 1: build
FROM node:16 AS development

WORKDIR /baizhi958216/frontend/src/app

COPY . .

RUN npm install -g pnpm
RUN pnpm install

RUN pnpm run build

EXPOSE 4200
