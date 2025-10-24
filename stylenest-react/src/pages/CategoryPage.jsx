import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { categories, productsByCategory } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";

function CategoryPage() {
  const { slug } = useParams();

  const { category, products } = useMemo(() => {
    const foundCategory = categories.find((item) => item.slug === slug);
    return {
      category: foundCategory,
      products: productsByCategory[slug] ?? [],
    };
  }, [slug]);

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
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}

export default CategoryPage;
