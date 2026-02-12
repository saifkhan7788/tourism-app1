# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:18-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copy frontend build to backend
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Railway exposes the PORT automatically
ENV PORT 3000
EXPOSE 3000

# Start backend
CMD ["node", "server.js"]
