# GuisedStore Backend

A highly scalable, secure, and production-ready e-commerce backend built with Node.js, Express, and PostgreSQL.

## 🌟 Features

### Architecture
- **Microservices-Ready Architecture**
- **API Gateway** (Nginx)
  - Load balancing (Round-robin, IP hash)
  - Rate limiting
  - SSL/TLS termination
  - Request caching
  - Health checks
  - CORS handling
  - Security headers

### Security
- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (RBAC)
  - Admin dashboard with secure login
- **Rate Limiting**
  - Redis-backed rate limiting
  - Tiered limits per endpoint:
    - Global: 100 requests/15min
    - Auth: 5 failed attempts/hour
    - Orders: 30 requests/15min
    - Search: 50 searches/5min
    - Payments: 10 requests/15min
- **Security Headers**
  - Helmet.js integration
  - Content Security Policy (CSP)
  - XSS protection
  - CORS configuration
- **Data Protection**
  - Sensitive data masking in logs
  - Password hashing with bcrypt
  - Environment variable protection

### Infrastructure
- **Message Queues** (RabbitMQ)
  - Order processing queue with transactions
  - Elasticsearch synchronization
  - Automatic retries with exponential backoff
  - Dead letter queues
  - Channel-based communication
  - Graceful shutdown handling

- **Caching Layer** (Redis)
  - Distributed caching system
  - Product data caching
  - Search results caching
  - Rate limiting storage
  - Configurable expiry times
  - Cache invalidation patterns

- **Search Engine** (Elasticsearch)
  - Product indexing and search
  - Category-based filtering
  - Real-time sync via queues
  - Fault-tolerant indexing
  - Session storage

### Security
- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (RBAC)
  - Session management
  - Password hashing with bcrypt
  - 2-Factor Authentication support
- **Rate Limiting**
  - Tiered rate limits by endpoint
  - IP-based and user-based limiting
  - Redis-backed for scalability
  - Configurable thresholds
- **Security Headers**
  - CORS protection
  - XSS protection
  - CSRF protection
  - Content Security Policy
  - HTTP Strict Transport Security
- **Data Protection**
  - Input validation
  - SQL injection prevention
  - Sensitive data masking in logs
  - Request sanitization

### Database
- **PostgreSQL**
  - Sequelize ORM
  - Database migrations
  - Data seeding
  - Connection pooling
  - Transactions support
- **Elasticsearch**
  - Product search
  - Full-text search
  - Fuzzy matching
  - Search result highlighting

### Admin Panel
- **AdminJS Integration**
  - CRUD operations
  - User management
  - Order management
  - Product management
  - Dashboard analytics
  - Custom actions

### Monitoring & Logging
- **Logging**
  - Winston logger
  - Multiple log levels
  - Daily rotating files
  - Production log masking
  - Request/Response logging
- **Health Checks**
  - Service health monitoring
  - Database connectivity
  - Queue connectivity
  - Cache connectivity

### Performance Optimizations
- **Caching Strategy**
  - Redis caching
  - In-memory caching
  - Cache invalidation
  - Query optimization
- **Database Optimization**
  - Index optimization
  - Query optimization
  - Connection pooling
  - Prepared statements

### Testing
- **Unit Tests**
  - Jest test framework
  - Service layer testing
  - Controller testing
  - Model testing
- **Integration Tests**
  - API endpoint testing
  - Database integration
  - Queue integration
- **Load Tests**
  - Performance benchmarks
  - Stress testing
  - Endpoint latency testing

### Implementation
- **Node.js & Express**
  - Structured service architecture
  - Controllers and routes separation
  - Middleware-based request processing
  - Response caching and compression

- **Database** (PostgreSQL)
  - Sequelize ORM integration
  - Transaction management
  - Connection pooling
  - Row-level locking for orders
  - Database migrations and seeders

- **Wallet System**
  - Transaction-based wallet operations
  - Balance tracking and updates
  - Payment processing queue
  - Concurrent access handling

- **API Features**
  - Product management and search
  - Shopping cart operations
  - Order processing with queues
  - User wallet management
  - Admin dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14.x
- PostgreSQL >= 13
- Redis >= 6
- RabbitMQ >= 3.8
- Elasticsearch >= 7.x

### Environment Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/guisedstore-backend.git
cd guisedstore-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. Database setup
```bash
# Run migrations
npx sequelize-cli db:migrate

# Seed initial data
npx sequelize-cli db:seed:all
```

### Running the Application
1. Development mode
```bash
npm run dev
```

2. Production mode
```bash
npm run build
npm start
```

## 🏗 Architecture

### Directory Structure
```plaintext
src/
├── config/        # Configuration files
├── services/      # Service modules
├── middleware/    # Custom middleware
├── models/        # Database models
├── queues/        # Queue processors
├── utils/         # Utility functions
└── admin/         # Admin panel setup
```

### API Routes
- `/api/auth` - Authentication endpoints
- `/api/products` - Product management
- `/api/orders` - Order processing
- `/api/cart` - Shopping cart
- `/api/wallet` - Wallet management

## 📚 API Documentation

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/signup` - User registration

### Products
- GET `/api/products` - List products
- GET `/api/products/:id` - Get product details
- GET `/api/products/search` - Search products
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

### Cart
- GET `/api/cart` - Get user's cart
- POST `/api/cart/items` - Add item to cart
- PUT `/api/cart/items/:id` - Update cart item
- DELETE `/api/cart/items/:id` - Remove cart item

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders` - List user's orders
- GET `/api/orders/:id` - Get order details
- POST `/api/orders/:id/cancel` - Cancel order

### Wallet
- GET `/api/wallet` - Get wallet balance
- POST `/api/wallet/topup` - Add funds to wallet
- GET `/api/wallet/transactions` - List transactions

## 📈 Scaling

### Horizontal Scaling
- Multiple backend instances
- Nginx load balancing
- Redis session sharing
- PostgreSQL replication

### Vertical Scaling
- Connection pool optimization
- Cache tuning
- Queue consumer scaling
- Resource allocation

## 🔧 Configuration

### Rate Limiting
```javascript
// Rate limits per endpoint
{
  global: 100,  // requests per 15 minutes
  auth: 5,      // failed attempts per hour
  orders: 30,   // requests per 15 minutes
  search: 50,   // searches per 5 minutes
  payment: 10   // requests per 15 minutes
}
```

### Security Headers
```javascript
// Content Security Policy
{
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", "data:", "https:"],
  connectSrc: ["'self'"]
}
```

## 📝 Logging

### Log Levels
- `error`: System errors
- `warn`: Warning conditions
- `info`: General information
- `debug`: Debug information

### Production Logging
- Sensitive data masking
- Structured JSON logging
- Log rotation
- Error tracking

## 📈 Monitoring & Logging

- Built-in logging with log levels
- Request/Response logging with sensitive data masking
- Error tracking and monitoring
- Performance metrics collection
- Queue monitoring and dead letter handling

## 🛡️ Error Handling

- Centralized error handling
- Custom error classes
- Transaction rollbacks
- Queue retries with backoff
- Graceful shutdown handlers

## ☁️ Cloud Deployment

### AWS Deployment
- EC2 instances for API
- RDS for PostgreSQL
- ElastiCache for Redis
- Amazon MQ for RabbitMQ
- ELB for load balancing

### Kubernetes Deployment
- Deployment configurations
- Service definitions
- Ingress controllers
- Auto-scaling

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

## 📊 Monitoring

### Health Checks
```bash
GET /health      # Basic health check
GET /health/deep # Detailed health check
```

### Metrics
- Request latency
- Error rates
- Queue length
- Cache hit rates

## 📝 License
MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 👥 Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.
