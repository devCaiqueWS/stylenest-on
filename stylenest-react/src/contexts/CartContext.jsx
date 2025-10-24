import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { formatCurrency } from "../utils/formatCurrency.js";

const CartContext = createContext();

const STORAGE_KEY = "stylenest-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Erro ao ler carrinho do localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Erro ao salvar carrinho", error);
    }
  }, [items]);

  const addItem = (product, size) => {
    setItems((prev) => [
      ...prev,
      {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
      },
    ]);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const summary = useMemo(() => {
    const total = items.reduce((acc, item) => acc + item.price, 0);
    return {
      total,
      formattedTotal: formatCurrency(total),
      count: items.length,
    };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      summary,
      addItem,
      removeItem,
      clearCart,
    }),
    [items, summary]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
};
