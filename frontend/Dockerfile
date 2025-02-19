# Build stage
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

ENV PUBLIC_URL=/sydneykart
ENV REACT_APP_PUBLIC_URL=/sydneykart

# Build the project
RUN npm run build

# Serve stage
FROM node:20-alpine

# Install serve globally
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/build ./build

# Expose port 4000
EXPOSE 4000

# Start serve
CMD ["serve", "-s", "build", "-l", "4000"]