FROM node:20-alpine

# Security: don't run as root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy deps first (Docker layer cache optimization)
COPY package*.json ./
RUN npm ci --only=production

COPY . .

USER appuser

EXPOSE 3004

CMD ["node", "index.js"]
