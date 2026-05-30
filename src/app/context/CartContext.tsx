import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Produto } from '../types';

export interface CartItem {
  produto: Produto;
  quantidade: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (produto: Produto, quantidade?: number) => void;
  removeItem: (produtoId: number | string) => void;
  updateQuantity: (produtoId: number | string, quantidade: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'distribpro_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = sessionStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (produto: Produto, quantidade = 1) => {
    setItems(prev => {
      const exists = prev.find(i => String(i.produto.id) === String(produto.id));
      if (exists) {
        return prev.map(i =>
          String(i.produto.id) === String(produto.id)
            ? { ...i, quantidade: i.quantidade + quantidade }
            : i
        );
      }
      return [...prev, { produto, quantidade }];
    });
  };

  const removeItem = (produtoId: number | string) => {
    setItems(prev => prev.filter(i => String(i.produto.id) !== String(produtoId)));
  };

  const updateQuantity = (produtoId: number | string, quantidade: number) => {
    if (quantidade <= 0) {
      removeItem(produtoId);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        String(i.produto.id) === String(produtoId) ? { ...i, quantidade } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, i) => acc + i.quantidade, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0);

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
