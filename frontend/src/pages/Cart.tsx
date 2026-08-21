import { useCallback, useEffect, useState } from "react";
import type { OrderItem as OrderItemType } from "../types/Order";
import { useAuth } from "../context/AuthContext";
import OrderItem from "../components/OrderItem";
import type { Order } from "../types/Order";
import { NavLink } from "react-router-dom";

function Cart() {
  const { token } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    if (!token) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load cart");
      }

      setOrder(data);
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateItem = (
    updatedItem: OrderItemType | null,
    removedItemId?: number,
  ) => {
    setOrder((currentOrder) => {
      if (!currentOrder) return currentOrder;

      // Remove item
      if (removedItemId !== undefined) {
        return {
          ...currentOrder,
          items: currentOrder.items.filter((item) => item.id !== removedItemId),
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
  };

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!order) {
    return <p>Cart is empty.</p>;
  }

  const totalPrice =
    order?.items?.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    ) ?? 0;

  return (
    <div className="page">
      {order.items?.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        order.items.map((item) => (
          <OrderItem key={item.id} item={item} onUpdate={updateItem} />
        ))
      )}
      <div className="cart-total">
        <h3>Total: ${totalPrice.toFixed(2)}</h3>

        <button className="btn btn-success">
          <NavLink
            to="/checkout"
            style={{ textDecoration: "none", color: "white" }}
          >
            Checkout
          </NavLink>
        </button>
      </div>
    </div>
  );
}

export default Cart;
