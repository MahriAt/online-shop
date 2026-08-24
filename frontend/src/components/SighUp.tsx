import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

export default function SignUp() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [emailClass, setEmailClass] = useState("");
  const [phoneClass, setPhoneClass] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let email = formData.email.match(emailRegex);
      let phone = formData.phone.match(phoneRegex);
      if (!email) {
        setEmailClass("is-invalid");
        throw new Error("Not valid email");
      } else {
        setEmailClass("");
      }
      if (!phone) {
        setPhoneClass("is-invalid");
        throw new Error("Not valid phone number");
      } else {
        setPhoneClass("");
      }
      const response = await apiFetch(`/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm order");
      }
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to confirm order",
      );
      console.log(error);
    }
  };
  return (
    <div className="page">
      <div className="form-signin w-100 m-auto">
        <h4 className="mb-3">Sign Up</h4>

        <form className="needs-validation" onSubmit={handleSubmit}>
          <div className="row g-3" style={{ textAlign: "left" }}>
            {/* FIRST NAME */}

            <div className="col-12">
              <label htmlFor="name" className="form-label">
                Name
              </label>

              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="John Jonson"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL */}

            <div className="col-12">
              <label htmlFor="email" className="form-label">
                Email{" "}
              </label>

              <input
                type="email"
                className={`form-control ${emailClass}`}
                id="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/*Phone */}
            <div className="col-12">
              <label htmlFor="phone" className="form-label">
                Phone{" "}
              </label>

              <input
                type="text"
                className={`form-control ${phoneClass}`}
                id="phone"
                placeholder="05055555555"
                value={formData.phone}
                onChange={handleChange}
                required
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

            <div className="col-12">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                id="password"
                placeholder="Password"
                required
              />
            </div>

            <hr className="my-4" />
            <p style={{ display: "none" }}>{error}</p>

            <button className="w-100 btn btn-primary btn-lg" type="submit">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
