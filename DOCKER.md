# Docker Deployment Guide

## Prerequisites
- Docker installed
- Docker Compose installed

## Quick Start

1. **Copy environment file:**
```bash
cp .env.docker .env
```

2. **Edit .env file** with your credentials

3. **Build and run:**
```bash
docker-compose up -d
```

4. **Access application:**
```
http://localhost:3001
```

## Commands

**Start:**
```bash
docker-compose up -d
```

**Stop:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f app
```

**Rebuild:**
```bash
docker-compose up -d --build
```

**Stop and remove everything:**
```bash
docker-compose down -v
```

## Production Deployment

1. Upload project folder to server
2. Install Docker & Docker Compose
3. Run `docker-compose up -d`
4. Access via server IP or domain

## Database Access

**Connect to MySQL:**
```bash
docker exec -it arabian-adventure-db mysql -u root -p
```

## Backup Database

```bash
docker exec arabian-adventure-db mysqldump -u root -p qatar_tourism > backup.sql
```

## Restore Database

```bash
docker exec -i arabian-adventure-db mysql -u root -p qatar_tourism < backup.sql
```
