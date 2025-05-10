# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Install nodemon globally
RUN npm install -g nodemon

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Create symbolic links for models to ensure consistent paths
RUN ln -s /app/models /app/src/models

# Expose the backend port
EXPOSE 3000

# Start the application (this will be overridden by docker-compose in development)
CMD ["npm", "start"]