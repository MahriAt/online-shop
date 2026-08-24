import { type Product } from "../types/Product";
import { useState } from "react";

import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showMore, setShowMore] = useState(false);
  const imageUrl =
    product.images.length > 0
      ? `http://localhost:3000${product.images[0].imageUrl}`
      : "http://localhost:3000/1786975887070-global-9349_64.png";

  const [currentImage, setCurrentImage] = useState(0);

  const { addToCart } = useCart();
  return (
    <div className="card" style={{ width: "18rem" }}>
      <img
        src={imageUrl}
        className="card-img-top"
        alt={product.name}
        style={{ height: "250px", objectFit: "contain" }}
        onClick={() => {
          setShowMore(!showMore);
        }}
      />
      <div className="card-body" style={{ height: "300px" }}>
        <h5
          className="card-title"
          style={{ height: "150px", overflow: "hidden" }}
          onClick={() => {
            setShowMore(!showMore);
          }}
        >
          {product.name}
        </h5>
        <p className="card-text">{product.price}$</p>
        <button
          className="btn btn-primary"
          onClick={() => addToCart(product.id)}
        >
          Add to cart
        </button>
      </div>
      {showMore && (
        <div className="product-card-popOut">
          <div className="product-card-popOut-images">
            {product.images.length > 0 && (
              <>
                <img
                  src={`http://localhost:3000${product.images[currentImage].imageUrl}`}
                  alt={product.name}
                />

                {product.images.length > 1 && (
                  <div className="image-buttons">
                    <button
                      onClick={() => {
                        setCurrentImage((prev) =>
                          prev === 0 ? product.images.length - 1 : prev - 1,
                        );
                      }}
                    >
                      ←
                    </button>

                    <span>
                      {currentImage + 1} / {product.images.length}
                    </span>

                    <button
                      onClick={() => {
                        setCurrentImage((prev) =>
                          prev === product.images.length - 1 ? 0 : prev + 1,
                        );
                      }}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="product-info">
            <h2>{product.name}</h2>

            <p>{product.description}</p>

            <button
              className="btn btn-primary"
              onClick={() => {
                setShowMore(false);
                setCurrentImage(0);
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
