FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/* \
  && npm install

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]

