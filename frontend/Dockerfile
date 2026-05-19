FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose port
EXPOSE 3000

# Command to run next dev
CMD ["npm", "run", "dev"]
