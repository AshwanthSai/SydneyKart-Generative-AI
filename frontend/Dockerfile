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


# Declare build arguments
ARG PUBLIC_URL
ARG REACT_APP_PUBLIC_URL
ARG REACT_APP_BACKEND_URL

# Set environment variables from build args with defaults
ENV PUBLIC_URL=$PUBLIC_URL
ENV REACT_APP_PUBLIC_URL=$REACT_APP_PUBLIC_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

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