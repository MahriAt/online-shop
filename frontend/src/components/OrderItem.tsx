import type { OrderItem as OrderItemType } from "../types/Order";

interface OrderItemProps {
  item: OrderItemType;
}

function OrderItem({ item }: OrderItemProps) {
  const total = Number(item.price) * item.quantity;

  return (
    <div className="cart-item">
      <div>
        <h5>{item.product.name}</h5>

        <p>Price: ${item.price}</p>

        <p>Quantity: {item.quantity}</p>

        <p>Total: ${total.toFixed(2)}</p>
      </div>

      <div>
        <button className="btn btn-danger">Remove</button>
      </div>
    </div>
  );
}

export default OrderItem;
