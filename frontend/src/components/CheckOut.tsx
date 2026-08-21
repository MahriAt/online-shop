import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Order } from "../types/Order";
import { useNavigate } from "react-router-dom";

export default function CheckOut() {
  const { token } = useAuth();
  const [success, setSuccess] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    address: "",
    address2: "",
    country: "",
    state: "",
    zip: "",
    paymentMethod: "credit",
    cardName: "",
    cardNumber: "",
    expiration: "",
    cvv: "",
  });

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
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const totalPrice =
    order?.items?.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    ) ?? 0;

  const totalItems =
    order?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!order) {
      return;
    }

    if (!token) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/orders/status/${order.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "confirmed",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm order");
      }

      setOrder(data);

      setSuccess(true);

      setTimeout(() => {
        navigate("/cart");
      }, 2000);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to confirm order",
      );
    }
  };

  // Later you can send the checkout data to your backend here.

  if (loading) {
    return (
      <div className="container py-5">
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (!order || order.items.length === 0) {
    return (
      <div className="page">
        <h2>Your cart is empty</h2>
        <p>Add some products before checking out.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <main>
        <div className="py-5 text-center">
          <img
            className="d-block mx-auto mb-4"
            src="./src/assets/logo-electro-dark.png"
            alt="Logo"
            height="57"
          />

          <h1 className="h2">Checkout form</h1>
        </div>

        <div className="row g-5">
          {/* ================= CART ================= */}

          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>

              <span className="badge bg-primary rounded-pill">
                {totalItems}
              </span>
            </h4>

            <ul className="list-group mb-3">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between lh-sm"
                >
                  <div>
                    <h6 className="my-0">{item.product.name}</h6>

                    <small className="text-body-secondary">
                      ${Number(item.price).toFixed(2)} × {item.quantity}
                    </small>
                  </div>

                  <span className="text-body-secondary">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}

              {/* TOTAL */}

              <li className="list-group-item d-flex justify-content-between">
                <span>Total (USD)</span>

                <strong>${totalPrice.toFixed(2)}</strong>
              </li>
            </ul>

            <form className="card p-2">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Promo code"
                />

                <button type="submit" className="btn btn-secondary">
                  Redeem
                </button>
              </div>
            </form>
          </div>

          {/* ================= BILLING ================= */}

          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Billing address</h4>

            <form className="needs-validation" onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* FIRST NAME */}

                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">
                    First name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* LAST NAME */}

                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">
                    Last name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* USERNAME */}

                <div className="col-12">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">@</span>

                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div className="col-12">
                  <label htmlFor="email" className="form-label">
                    Email{" "}
                    <span className="text-body-secondary">(Optional)</span>
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* ADDRESS */}

                <div className="col-12">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="1234 Main St"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* ADDRESS 2 */}

                <div className="col-12">
                  <label htmlFor="address2" className="form-label">
                    Address 2{" "}
                    <span className="text-body-secondary">(Optional)</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="address2"
                    placeholder="Apartment or suite"
                    value={formData.address2}
                    onChange={handleChange}
                  />
                </div>

                {/* COUNTRY */}

                <div className="col-md-5">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>

                  <select
                    className="form-select"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose...</option>
                    <option>Türkiye</option>
                    <option>United States</option>
                    <option>Germany</option>
                    <option>United Kingdom</option>
                  </select>
                </div>

                {/* STATE */}

                <div className="col-md-4">
                  <label htmlFor="state" className="form-label">
                    State / City
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* ZIP */}

                <div className="col-md-3">
                  <label htmlFor="zip" className="form-label">
                    Zip
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <hr className="my-4" />

              {/* ================= PAYMENT ================= */}

              <h4 className="mb-3">Payment</h4>

              <div className="my-3">
                <div className="form-check">
                  <input
                    id="credit"
                    name="paymentMethod"
                    type="radio"
                    className="form-check-input"
                    value="credit"
                    checked={formData.paymentMethod === "credit"}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentMethod: "credit",
                      }))
                    }
                    required
                  />

                  <label className="form-check-label" htmlFor="credit">
                    Credit card
                  </label>
                </div>

                <div className="form-check">
                  <input
                    id="debit"
                    name="paymentMethod"
                    type="radio"
                    className="form-check-input"
                    value="debit"
                    checked={formData.paymentMethod === "debit"}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentMethod: "debit",
                      }))
                    }
                  />

                  <label className="form-check-label" htmlFor="debit">
                    Debit card
                  </label>
                </div>

                <div className="form-check">
                  <input
                    id="paypal"
                    name="paymentMethod"
                    type="radio"
                    className="form-check-input"
                    value="paypal"
                    checked={formData.paymentMethod === "paypal"}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentMethod: "paypal",
                      }))
                    }
                  />

                  <label className="form-check-label" htmlFor="paypal">
                    PayPal
                  </label>
                </div>
              </div>

              {/* ================= CARD ================= */}

              {formData.paymentMethod !== "paypal" && (
                <div className="row gy-3">
                  <div className="col-md-6">
                    <label htmlFor="cardName" className="form-label">
                      Name on card
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      id="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="cardNumber" className="form-label">
                      Card number
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="expiration" className="form-label">
                      Expiration
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      id="expiration"
                      placeholder="MM/YY"
                      value={formData.expiration}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="cvv" className="form-label">
                      CVV
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      id="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <hr className="my-4" />

              <button className="w-100 btn btn-primary btn-lg" type="submit">
                Continue to checkout — ${totalPrice.toFixed(2)}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
