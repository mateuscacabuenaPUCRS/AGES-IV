FROM node:20-alpine AS builder
WORKDIR /usr/src/app

RUN apk add --no-cache openssl libc6-compat

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN npx prisma generate

RUN yarn build

FROM node:20-alpine AS runtime
WORKDIR /usr/src/app
RUN apk add --no-cache openssl libc6-compat
COPY package.json ./

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

CMD ["./entrypoint.sh"]
