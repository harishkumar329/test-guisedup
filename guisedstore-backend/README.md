# GuisedStore Backend

A highly scalable, secure, and production-ready e-commerce backend built with Node.js, Express, PostgreSQL, Nginx, ElasticSearch & Redis.

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
  - Graceful shutdown handling

- **Caching Layer** (Redis)
  - Product data caching
  - Search results caching
  - Rate limiting storage

- **Search Engine** (Elasticsearch)
  - Product indexing and search
  - Category-based filtering
  - Real-time sync via queues

### Security
- **Authentication & Authorization**
  - JWT-based authentication
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


## 🏗 Architecture

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
