FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/* \
  && npm install

COPY . .

RUN npx prisma generate

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD ["npm", "run", "start:dev"]

