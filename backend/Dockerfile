FROM node:18-alpine

WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose port
EXPOSE 5000

# Command to run dependencies sync, prisma generation, and start nodemon
CMD ["sh", "-c", "npm install && npx prisma generate && npm run dev"]
