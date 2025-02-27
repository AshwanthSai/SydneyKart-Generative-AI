# Build stage
FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build arguments and env vars
ARG REACT_APP_PROD_BACKEND_URL
ARG REACT_APP_PUBLIC_URL_PROD
ARG PUBLIC_URL
ENV REACT_APP_PROD_BACKEND_URL=$REACT_APP_PROD_BACKEND_URL
ENV REACT_APP_PUBLIC_URL_PROD=$REACT_APP_PUBLIC_URL_PROD
ENV PUBLIC_URL=$PUBLIC_URL

# Build the project
RUN npm run build

# Serve stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]