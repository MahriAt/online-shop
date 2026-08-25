import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { apiFetch } from "../api/api";
import type { Order, OrderItem as OrderItemType } from "../types/Order";

interface CartContextType {
  order: Order | null;
  loading: boolean;
  error: string;
  cartItemCount: number;

  loadCart: () => Promise<void>;
  addToCart: (productId: number) => Promise<void>;

  updateItem: (
    updatedItem: OrderItemType | null,
    removedItemId?: number,
  ) => void;

  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    if (!token) {
      alert("Please log in to add products to your cart.");
      setOrder(null);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/orders", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load cart");
      }

      setOrder(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateItem = useCallback(
    (updatedItem: OrderItemType | null, removedItemId?: number) => {
      setOrder((currentOrder) => {
        if (!currentOrder) return currentOrder;

        // Remove item
        if (removedItemId !== undefined) {
          return {
            ...currentOrder,
            items: currentOrder.items.filter(
              (item) => item.id !== removedItemId,
            ),
          };
        }

        // Update item
        if (updatedItem) {
          return {
            ...currentOrder,
            items: currentOrder.items.map((item) =>
              item.id === updatedItem.id ? updatedItem : item,
            ),
          };
        }

        return currentOrder;
      });
    },
    [],
  );
  const addToCart = useCallback(async (productId: number) => {
    if (!token) {
      alert("Please log in to add products to your cart.");
      return;
    }
    try {
      const response = await apiFetch("/orders/orderItem", {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      console.log("Added item:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to add product");
      }

      setOrder((currentOrder) => {
        if (!currentOrder) return currentOrder;

        const exists = currentOrder.items.some((item) => item.id === data.id);

        if (exists) {
          return {
            ...currentOrder,
            items: currentOrder.items.map((item) =>
              item.id === data.id ? data : item,
            ),
          };
        }

        return {
          ...currentOrder,
          items: [...currentOrder.items, data],
        };
      });
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  }, []);

  const clearCart = useCallback(() => {
    setOrder(null);
  }, []);

  const cartItemCount = useMemo(() => {
    return order?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
  }, [order]);

  return (
    <CartContext.Provider
      value={{
        order,
        loading,
        error,
        cartItemCount,
        loadCart,
        addToCart,
        updateItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
