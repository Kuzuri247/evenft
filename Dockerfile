FROM node:20-alpine

WORKDIR /app

# Install build dependencies and Linux headers
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
# Only generate Prisma client at build time
RUN npx prisma generate

# Create startup script
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo 'echo "Running database migrations..."' >> /docker-entrypoint.sh && \
    echo 'npx prisma migrate dev' >> /docker-entrypoint.sh && \
    echo 'echo "Starting application..."' >> /docker-entrypoint.sh && \
    echo 'exec yarn dev' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"] 