FROM node:20-bullseye-slim

WORKDIR /app

RUN npm install -g pnpm pm2

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm i

COPY . .

RUN pnpm build
RUN rm -rf .env*
RUN rm -rf *.bat
RUN rm -rf *.sh

EXPOSE 8000

CMD ["pnpm", "serve"]