#!/bin/sh
echo "Initializing database..."
node init-db.js || echo "Database initialization failed or already initialized"
echo "Starting server..."
node server.js
