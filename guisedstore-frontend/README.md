# GuisedStore Frontend

Modern, responsive e-commerce frontend built with Angular and Material Design.

## 🌟 Features

### User Interface
- **Material Design**
  - Clean, modern UI components
  - Responsive layout
  - Dark/Light theme support
  - Custom animations
  - Optimized loading states

### Core Features
- **Product Management**
  - Dynamic product listing
  - Advanced search & filtering
  - Category navigation
  - Product details with images
  - Related products

- **Shopping Experience**
  - Real-time cart management
  - Wishlist functionality
  - Order tracking
  - Secure checkout process
  - Wallet integration

- **User Management**
  - JWT-based authentication
  - Profile management
  - Order history
  - Wallet transactions
  - Saved addresses

### Technical Features
- **State Management**
  - NgRx store implementation
  - Effects for API calls
  - Selectors for data access
  - Action-based updates

- **Performance**
  - Lazy loading modules
  - Image optimization
  - Bundle optimization
  - Route preloading
  - Service worker caching

- **Security**
  - XSS prevention
  - CSRF protection
  - Secure HTTP headers
  - Input sanitization
  - Route guards

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14.x
- Angular CLI >= 14.x
- npm >= 7.x

### Development Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/guisedstore-frontend.git
cd guisedstore-frontend
```

2. Install dependencies
```bash
npm install
```

3. Environment configuration
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
# Edit environment.ts with your configurations
```

4. Start development server
```bash
ng serve
```

The application will be available at `http://localhost:4200`

### Production Build
```bash
ng build --configuration=production
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/              # Core modules, guards, services
│   ├── shared/            # Shared modules, components
│   ├── features/          # Feature modules
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── profile/
│   └── store/            # NgRx store
├── assets/
├── environments/
└── styles/
```

## 🎨 UI Components

### Material Design Integration
- Custom theme configuration
- Responsive navigation
- Material forms and inputs
- Loading indicators
- Dialogs and modals

### Layout Components
- Responsive grid system
- Flex layout utilities
- Breakpoint observers
- Custom containers

## 📱 Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Responsive images
- Touch-friendly interfaces
- Adaptive navigation

## 🔧 Configuration

### Environment Settings
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  imageBaseUrl: 'https://cdn.guisedstore.com',
  maxFileSize: 5242880,
  supportedImageTypes: ['image/jpeg', 'image/png']
};
```

## 📈 Performance Optimization

### Lazy Loading
```typescript
// App routing module
const routes: Routes = [
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.module')
      .then(m => m.ProductsModule)
  }
];
```

### Caching Strategy
- API response caching
- Static asset caching
- Service worker implementation
- Progressive Web App (PWA)

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
ng test

# Generate coverage report
ng test --code-coverage
```

### E2E Tests
```bash
# Run e2e tests
ng e2e
```

## 🔍 Code Quality

- ESLint configuration
- Prettier formatting
- Husky pre-commit hooks
- Conventional commits
- SonarQube integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
