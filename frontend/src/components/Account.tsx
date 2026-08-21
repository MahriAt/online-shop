import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export interface Account {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function Account() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/users/account", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response:", response);
        console.log("Status:", response.status);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch account");
        }

        setAccount(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load account",
        );

        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [token]);

  if (loading) {
    return <p>Loading account...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!account) {
    return <p>Account not found.</p>;
  }

  return (
    <div className="page">
      <h3>Your Account</h3>

      <p>
        <strong>Name:</strong> {account.name}
      </p>

      <p>
        <strong>Email:</strong> {account.email}
      </p>

      <p>
        <strong>Phone:</strong> {account.phone}
      </p>

      <p>
        <strong>Address:</strong> {account.address}
      </p>
    </div>
  );
}
