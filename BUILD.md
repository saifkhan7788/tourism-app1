# Build Instructions

## Create Executable for Client Deployment

### 1. Install pkg
```bash
cd backend
npm install
```

### 2. Build Frontend
```bash
cd ../frontend
npm run build
```

### 3. Create Executable
```bash
cd ../backend
npm run build
```

This creates `backend/dist/arabian-adventure.exe`

### 4. Package for Client
Create a folder with:
```
deployment/
├── arabian-adventure.exe
├── .env.example
├── uploads/ (empty folder)
├── database/
│   └── schema.sql
└── README.txt
```

### 5. Client Setup
Client needs to:
1. Install MySQL
2. Run schema.sql
3. Create .env file with database credentials
4. Run arabian-adventure.exe
5. Access at http://localhost:3001

## .env.example
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=qatar_tourism
JWT_SECRET=your_secret_key
PORT=3001
NODE_ENV=production
```
