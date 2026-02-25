// Export all hooks from a single entry point
export { useAuth } from '../context/AuthContext';
export { useCart } from '../context/CartContext';
export { useProducts, useProductsByCategory, useProduct } from './useProducts';
export { useOrders, useOrder } from './useOrders';
