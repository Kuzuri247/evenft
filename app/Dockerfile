FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN npx prisma generate
RUN npx prisma migrate dev

EXPOSE 3000

CMD ["yarn", "dev"] 