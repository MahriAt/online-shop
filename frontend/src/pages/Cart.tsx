import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import OrderItem from "../components/OrderItem";
import type { Order } from "../types/Order";

function Cart() {
  const { token } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCart = async () => {
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
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load cart",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [token]);

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!order) {
    return <p>Cart is empty.</p>;
  }
  const totalPrice = order.items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  return (
    <div className="container">
      <h1>Shopping Cart</h1>

      {order.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        order.items.map((item) => <OrderItem key={item.id} item={item} />)
      )}
      <div className="cart-total">
        <h3>Total: ${totalPrice.toFixed(2)}</h3>

        <button className="btn btn-success">Checkout</button>
      </div>
    </div>
  );
}

export default Cart;
