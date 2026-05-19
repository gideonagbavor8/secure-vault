FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose port
EXPOSE 5000

# Command to run nodemon with ts-node
CMD ["npm", "run", "dev"]
