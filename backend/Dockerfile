# Use Node.js image
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
