# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copy only package.json first (cache npm install)
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of frontend code and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:18-alpine

WORKDIR /app

# Copy backend package.json and install dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend code
COPY backend/ ./

# Copy frontend build from stage 1
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Expose port your backend uses
EXPOSE 3001

# Start backend
CMD ["node", "server.js"]
