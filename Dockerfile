# ----------------------
# Stage 1: Build Frontend
# ----------------------
FROM node:18-alpine AS frontend-build

# Set working directory for frontend
WORKDIR /app/frontend

# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Build React frontend
RUN npm run build

# ----------------------
# Stage 2: Build Backend
# ----------------------
FROM node:18-alpine

# Set working directory for backend
WORKDIR /app

# Copy backend package files and install dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source
COPY backend/ ./

# Copy frontend build into backend for production serving
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Copy schema and init-db script
COPY backend/init-db.js ./backend/init-db.js
COPY schema.sql ./backend/schema.sql

# Set environment variables for Railway (PORT will be overridden automatically)
ENV NODE_ENV=production
ENV PORT=3000

# Run init-db.js once during build (idempotent)
RUN node backend/init-db.js || echo "Schema may already exist, continuing..."

# Expose the app port
EXPOSE 3000

# Start backend server
CMD ["node", "server.js"]
