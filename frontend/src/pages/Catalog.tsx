import ProductCard from "../components/ProductCard";
import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { apiFetch } from "../api/api";

interface Category {
  id: number;
  name: string;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const loadCategories = async () => {
    try {
      const response = await apiFetch(`/categories`, {
        method: "GET",
      });
      const data: Category[] = await response.json();
      setCategory(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load categories");
    }
  };

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);

      const url = selectedCategory
        ? `/products/category/${selectedCategory}`
        : "/products";
      const response = await apiFetch(url, {
        method: "GET",
      });
      console.log("Response:", response);
      console.log("Status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: Product[] = await response.json();

      setProducts(data);
      console.log(url);
    } catch (error) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const selectCategory = (id: number) => {
    setSelectedCategory(id === 0 ? null : id);
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className="page">
        <div>
          <select
            className="form-select"
            value={selectedCategory ?? 0}
            onChange={(e) => selectCategory(Number(e.target.value))}
            style={{ width: "30%", margin: "10px" }}
          >
            <option value={0}>Select</option>
            {category.map((categories) => (
              <option key={categories.id} value={categories.id}>
                {categories.name}
              </option>
            ))}
          </select>
        </div>
        <div className="row g-4">
          {products.map((product) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
