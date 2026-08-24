import OrderItem from "../components/OrderItem";

import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const { order, loading, error, updateItem } = useCart();

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
