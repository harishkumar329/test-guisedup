# GuisedStore - Full Stack E-commerce Platform

A modern, scalable, and secure e-commerce platform built with Node.js/Express backend and Angular frontend.

## 🌟 Project Overview

GuisedStore is a full-featured e-commerce platform that demonstrates industry best practices in both backend and frontend development. The project is split into two main components:

- [Backend Documentation](./guisedstore-backend/README.md) - Node.js/Express backend with PostgreSQL
- [Frontend Documentation](./guisedstore-frontend/README.md) - Angular frontend with Tailwind CSS

## 🏗️ Architecture

```
GuisedStore
├── Backend (Node.js/Express)
│   ├── API Gateway (Nginx)
│   ├── Message Queues (RabbitMQ)
│   ├── Caching (Redis)
│   ├── Search Engine (Elasticsearch)
│   └── Database (PostgreSQL)
└── Frontend (Angular)
    ├── Tailwind CSS
    ├── NgRx State Management
    ├── Responsive Design
    └── PWA Support
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 14.x
- Docker and Docker Compose
- PostgreSQL >= 13
- Redis >= 6
- RabbitMQ >= 3.8
- Elasticsearch >= 7.x

### Setting Up the Project

1. Clone the repository
```bash
git clone https://github.com/yourusername/guisedstore.git
cd guisedstore
```

2. Set up backend
```bash
cd guisedstore-backend
npm install
cp .env.example .env
# Edit .env with your configurations
npx sequelize-cli db:migrate --config ./src/config/config.js
npx sequelize-cli db:seed:all --config ./src/config/config.js
```

3. Set up frontend
```bash
cd ../guisedstore-frontend/guisedstore
npm install
cp src/environments/environment.example.ts src/environments/environment.ts
# Edit environment.ts with your configurations
```

4. Start development servers

In one terminal:
```bash
cd guisedstore-backend
npm run dev
```

In another terminal:
```bash
cd guisedstore-frontend/guisedstore
ng serve
```

Visit `http://localhost:4200` to see the application running.

## 🐳 Docker Deployment

To run the entire stack using Docker:

```bash
# Start the stack
docker-compose -f docker-compose.yml -f docker-compose.gateway.yml up -d

# To stop
docker-compose -f docker-compose.yml -f docker-compose.gateway.yml down
```

## 📚 Documentation

For detailed documentation:
- [Backend Implementation Details](./guisedstore-backend/README.md)
- [Frontend Implementation Details](./guisedstore-frontend/README.md)

## 🛠️ Development

- Backend runs on `http://localhost:3000`
- Frontend runs on `http://localhost:4200`
- API Gateway runs on `http://localhost:8080`
- Admin dashboard on `http://localhost:3000/admin`

## 🔐 Security

- JWT authentication
- Rate limiting
- CORS protection
- XSS prevention
- SQL injection protection
- Content Security Policy
- Secure headers
