# Specify Node Version and Image
# Name Image development (can be anything)
FROM node:16 AS development

# Specify Working directory 
WORKDIR /baizhi958216/src/app

# Copy pageage-lock.json & pageage.json from host to inside container working directory
COPY . /baizhi958216/src/app

# Install deps inside container
RUN npm install -g pnpm
RUN pnpm install

# Bundle App Sources
# COPY . .

RUN pnpm run build

EXPOSE 3000

################
## PRODUCTION ##
################
# Build another image named production
FROM node:16 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set work dir
WORKDIR /baizhi958216/src/app

COPY . /baizhi958216/src/app
# COPY --from=development /baizhi958216/src/app/ .

EXPOSE 3000

CMD ["node","dist/main"]