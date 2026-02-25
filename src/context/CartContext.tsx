import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product, CartItem, Cart } from '../types';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

const TAX_RATE = 0.10; // 10% tax

const calculateTotals = (items: CartItem[]): Cart => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return {
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart>(() => {
    // Initialize from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const items = JSON.parse(storedCart) as CartItem[];
        return calculateTotals(items);
      } catch {
        return calculateTotals([]);
      }
    }
    return calculateTotals([]);
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart.items));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.product.id === product.id
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item
        newItems = [...prevCart.items, { product, quantity }];
      }

      return calculateTotals(newItems);
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.product.id !== productId);
      return calculateTotals(newItems);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      return calculateTotals(newItems);
    });
  };

  const clearCart = () => {
    setCart(calculateTotals([]));
    localStorage.removeItem('cart');
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
