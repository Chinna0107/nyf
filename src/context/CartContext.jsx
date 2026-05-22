/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CART_KEY = 'meda_cart';

const match = (i, id, size, color) => i.id === id && i.size === size && i.color === color;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => match(i, item.id, item.size, item.color));
      if (existing) {
        return prev.map(i =>
          match(i, item.id, item.size, item.color)
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id, size, color) => {
    setCart(prev => prev.filter(i => !match(i, id, size, color)));
  };

  const updateQuantity = (id, size, color, quantity) => {
    if (quantity < 1) return removeFromCart(id, size, color);
    setCart(prev => prev.map(i => match(i, id, size, color) ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, cartItems: cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
