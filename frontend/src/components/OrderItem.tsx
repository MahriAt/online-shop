import type { OrderItem as OrderItemType } from "../types/Order";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/api";
import "../styles/OrderItem.css";

interface OrderItemProps {
  item: OrderItemType;
  onUpdate: (updatedItem: OrderItemType | null, removedItemId?: number) => void;
}

function OrderItem({ item, onUpdate }: OrderItemProps) {
  const API_URL = import.meta.env.VITE_API_URL;
  const total = Number(item.price) * item.quantity;
  const { token } = useAuth();
  const removeAll = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const response = await apiFetch(`/orders/orderItem`, {
        method: "DELETE",
        body: JSON.stringify({
          productId: item.product.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove product");
      }

      // Tell Cart to remove THIS item immediately
      onUpdate(null, item.id);
    } catch (error) {
      console.error(error);
    }
  };
  const add = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }
    try {
      const response = await apiFetch(`/orders/orderItem`, {
        method: "POST",
        body: JSON.stringify({
          productId: item.product.id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to increase quantity");
      }

      onUpdate(data);
    } catch (error) {
      console.error(error);
    }
  };

  const substruct = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }
    try {
      const response = await apiFetch(`/orders/orderItem`, {
        method: "DELETE",
        body: JSON.stringify({
          productId: item.product.id,
          quantity: 1,
        }),
      });

      if (item.quantity === 1) {
        onUpdate(null, item.id);
      } else {
        const data = await response.json();
        // Otherwise update the item
        onUpdate(data);
      }
      if (!response.ok) {
        throw new Error("Failed to decrease quantity");
      }

      // If quantity became 0, backend deleted the item
    } catch (error) {
      console.error(error);
    }
  };

  const imageUrl = `${API_URL}${item.product.images[0].imageUrl}`;
  return (
    <div className="cart-item">
      <div className="cart-item-product-info">
        <div className="cart-item-product-info-img">
          <img
            src={imageUrl}
            alt="image"
            style={{ height: "100px", objectFit: "contain" }}
          />
        </div>
        <div className="cart-item-product-info-text">
          <h5>{item.product.name}</h5>

          <p>Price: ${item.price}</p>
          <p>Total: ${total.toFixed(2)}</p>
        </div>

        <div className="cart-item-product-info-remove">
          <button className="btn btn-danger" onClick={removeAll}>
            Remove
          </button>
        </div>
      </div>
      <div
        className="cart-item-add-sub-quantity"
        style={{ display: "flex", margin: "auto" }}
      >
        <button onClick={substruct}>-</button>
        <p>{item.quantity}</p>
        <button onClick={add}>+</button>
      </div>
    </div>
  );
}

export default OrderItem;
