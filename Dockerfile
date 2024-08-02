FROM node:latest

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm i

RUN pnpm build

FROM nginx:stable-alpine
COPY --from=0 /app/dist /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/
