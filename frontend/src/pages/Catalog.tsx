import ProductCard from "../components/ProductCard";
export default function Catalog() {
  return (
    <>
      <div className="page">
        <h1>Catalog page</h1>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </>
  );
}
