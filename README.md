# 🔥 La Diabla Pizzería - React Application

A modern, full-featured e-commerce web application for a pizzeria, built with React, TypeScript, Vite, TailwindCSS, and DaisyUI.

**🍕 Authentic Products from Il Napolitano** - Featuring real Argentine pizza varieties and product images!

## ✨ Features

### Customer Features
- 🏠 **Home Page** - Hero section with featured products
- 🍕 **Menu** - Browse all pizzas with category filtering
- 🛒 **Shopping Cart** - Add, remove, and manage items
- 💳 **Checkout** - Complete order process (backend required)
- 🔍 **Order Tracking** - Track order status by order ID and email
- 📍 **Locations** - Find nearby branches
- 📞 **Contact** - Contact form and information
- ℹ️ **About** - Company information

### Admin Features (Backend Required)
- 📊 **Dashboard** - Overview of products, orders, and revenue
- 📦 **Product Management** - CRUD operations for menu items
- 📋 **Order Management** - View and update order status
- 🔐 **Protected Admin Routes** - Access control for admin users

### Technical Features
- 🔐 **Authentication** - Login/Register with JWT tokens
- 🛒 **Cart Management** - Persistent cart with localStorage
- 🎨 **Modern UI** - TailwindCSS + DaisyUI components
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Fast Performance** - Vite for lightning-fast dev experience
- 🎯 **Type Safety** - Full TypeScript support
- 🧩 **Component-Based** - Reusable React components
- 🔄 **Context API** - Global state management

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PHP 8.1+ (for backend)
- MySQL/MariaDB (for backend)
- Composer (for backend)

### Backend Setup (La Diabla Laravel API)

The backend API is located in the sibling folder `la-diabla`. Follow these steps to set it up:

1. **Navigate to backend folder**
   ```bash
   cd c:\xampp\htdocs\la-diabla
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your database:
   ```env
   DB_DATABASE=la_diabla
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Create database**
   ```sql
   CREATE DATABASE la_diabla;
   ```

5. **Generate application key**
   ```bash
   php artisan key:generate
   ```

6. **Run migrations and seeders**
   ```bash
   php artisan migrate:fresh --seed
   ```
   
   This will create:
   - 7 Argentine Pizzas (Muzzarella, Napolitana, 4 Quesos, Albahaca, Jamón y Morrón, Rúcula, Fugazzeta)
   - 4 Bebidas (Coca-Cola Zero, Sprite, Agua, Quilmes)
   - 4 Entradas (Empanadas, Ensalada, Fainá, Papas con Cheddar)
   - 3 Postres (Tiramisú, Brownie, Helado)
   - All with authentic Il Napolitano product images!
   - Admin user: `admin@ladiabla.com` / `diabla2026`
   - Customer user: `cliente@ladiabla.com` / `cliente2026`

7. **Start Laravel development server**
   ```bash
   php artisan serve
   ```
   
   Backend will be available at `http://localhost:8000`

   **Alternative (XAMPP/Apache):** Access via `http://localhost/la-diabla/public`

### Frontend Setup (This App)

1. **Clone the repository**
   ```bash
   cd c:\xampp\htdocs\la-diabla-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your API URL:
   ```env
   # For Laravel development server
   VITE_API_URL=http://localhost:8000/api
   
   # Or for XAMPP/Apache
   # VITE_API_URL=http://localhost/la-diabla/public/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/          # Admin panel components
│   ├── auth/           # Login & Register
│   ├── common/         # Navbar, Footer, Loading, etc.
│   ├── layouts/        # Layout wrappers
│   └── pages/          # Page components
├── context/
│   ├── AuthContext.tsx # Authentication state
│   └── CartContext.tsx # Shopping cart state
├── hooks/              # Custom React hooks
│   ├── useProducts.ts
│   ├── useOrders.ts
│   └── index.ts
├── services/           # API service layer
│   ├── api.ts          # Axios configuration
│   ├── authService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   └── contactService.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── routes/             # Routing configuration
│   └── AppRoutes.tsx
├── App.tsx             # Main App component
├── main.tsx            # Entry point
└── index.css           # Global styles + Tailwind
```

## 🎨 Tech Stack

- **Frontend Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS + DaisyUI
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **State Management:** Context API
- **Icons:** Font Awesome (via CDN in index.html)
- **Fonts:** Google Fonts (Oswald, Work Sans)

## 🔌 API Integration

This app is connected to the **la-diabla** Laravel backend API (sibling folder).

### API Base URL
- Development: `http://localhost:8000/api`
- XAMPP/Apache: `http://localhost/la-diabla/public/api`

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)
- `PUT /auth/profile` - Update profile (protected)

### Product Endpoints
- `GET /products` - Get all products
- `GET /products/{id}` - Get product by ID
- `GET /products/image/{filename}` - Get product image
- `POST /admin/products` - Create product (admin)
- `PUT /admin/products/{id}` - Update product (admin)
- `DELETE /admin/products/{id}` - Delete product (admin)

### Category Endpoints
- `GET /categories` - Get all categories
- `GET /categories/{id}` - Get category by ID
- `GET /admin/categories` - Admin category list
- `POST /admin/categories` - Create category (admin)
- `PUT /admin/categories/{id}` - Update category (admin)
- `DELETE /admin/categories/{id}` - Delete category (admin)

### Order Endpoints
- `POST /orders` - Create new order
- `GET /orders/{id}` - Get order by ID
- `POST /orders/track` - Track order by ID and email
- `GET /admin/orders` - Get all orders (admin)
- `PUT /admin/orders/{id}/status` - Update order status (admin)
- `DELETE /admin/orders/{id}` - Delete order (admin)
- `GET /admin/orders/statistics` - Get order statistics (admin)

### Product Catalog

**Il Napolitano Integration:**  
All pizza images and authentic Argentine products from **Project-Il-Napolitano**:
- 🍕 **7 Argentine Pizzas** - Muzzarella, Napolitana, 4 Quesos, Albahaca, Jamón y Morrón, Rúcula, Fugazzeta (€8.99-€13.99)
- 🥤 **4 Bebidas** - Coca-Cola Zero, Sprite, Agua, Quilmes (€1.50-€3.50)
- 🍗 **4 Entradas Argentinas** - Empanadas Criollas, Ensalada, Fainá, Papas con Cheddar (€4.50-€8.99)
- 🍰 **3 Postres** - Tiramisú, Brownie, Helado (€4.50-€5.99)

**Demo Credentials:**
- Admin: `admin@ladiabla.com` / `diabla2026`
- Customer: `cliente@ladiabla.com` / `cliente2026`

## 🎯 Quick Start Guide

### For Full Development (with Backend)
1. Start the la-diabla Laravel backend: `php artisan serve`
2. Start this frontend app: `npm run dev`
3. Login with admin credentials to access admin panel
4. All products from la-diabla backend will be loaded automatically

### For Frontend-Only Development
1. The app structure works without backend
2. Mock data can be added to services for testing UI
3. Cart functionality works with localStorage (no backend needed)

### Testing the Integration
1. **Home Page** - Products loaded from backend API
2. **Menu** - Browse products by category
3. **Cart** - Add items (persisted locally)
4. **Login** - Use demo credentials
5. **Admin Panel** - Manage products and orders (requires admin login)
6. **Order Tracking** - Track orders created through checkout

### Demo Access
- **Admin Panel**: Login with `admin@ladiabla.com` / `diabla2026`
- **Customer View**: Login with `cliente@ladiabla.com` / `cliente2026`
- **Products**: 16 products across 4 categories (auto-loaded from backend)

## 🎨 Customization

### Colors
Edit colors in [tailwind.config.js](tailwind.config.js):
```js
diabla: {
  red: '#DC2626',
  dark: '#1F2937',
  cream: '#FEF3C7',
  gold: '#F59E0B',
  green: '#10B981',
}
```

### Components
All components use Tailwind utility classes and are fully customizable.

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Contributing

This is a custom project created by merging features from soyApp and Project-Il-Napolitano.

## 📄 License

Private Project

## 👨‍💻 Development Notes

- Built by merging features from **soyApp** (React+Vite) and **Project-Il-Napolitano** (PHP pizzeria)
- Connected to **la-diabla** Laravel backend API (sibling project)
- Product catalog imported from la-diabla database seeders
- Modern React patterns with hooks and Context API
- Backend-ready architecture with service layer abstraction
- Scalable component structure following best practices
- Type-safe development with TypeScript
- Responsive design with TailwindCSS + DaisyUI

### Project Architecture
```
la-diabla-app/          (React Frontend - This app)
├── src/
│   ├── components/     (UI Components)
│   ├── context/        (Global State)
│   ├── services/       (API Integration)
│   └── types/          (TypeScript Definitions)
└── .env                (API Configuration)

la-diabla/              (Laravel Backend - Sibling folder)
├── app/
│   ├── Http/Controllers/
│   └── Models/
├── database/
│   └── seeders/        (Product Data)
└── routes/
    └── api.php         (API Endpoints)
```

---

Built with ❤️ for La Diabla Pizzería 🔥🍕
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
