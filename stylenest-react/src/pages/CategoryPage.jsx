import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { categories } from "../data/products.js";
import { useCategoryProducts } from "../hooks/useCategoryProducts.js";
import ProductCard from "../components/ProductCard.jsx";

function CategoryPage() {
  const { slug } = useParams();
  const category = useMemo(() => categories.find((item) => item.slug === slug), [slug]);
  const { products, loading, error } = useCategoryProducts(slug);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-wrapper">
      <section className="hero-text" style={{ padding: "20px 0 40px" }}>
        <h2>{category.title}</h2>
        <p>{category.description}</p>
      </section>
      <section className="product-grid">
        {loading && (
          <p className="product-grid__status" aria-live="polite">
            Carregando produtos...
          </p>
        )}
        {!loading && error && (
          <p className="product-grid__status product-grid__status--error" role="status">
            {error}
          </p>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="product-grid__status" aria-live="polite">
            Nenhum produto disponivel no momento.
          </p>
        )}
        {!loading && !error &&
          products.map((product) => <ProductCard key={product.id} product={product} />)}
      </section>
    </div>
  );
}

export default CategoryPage;
