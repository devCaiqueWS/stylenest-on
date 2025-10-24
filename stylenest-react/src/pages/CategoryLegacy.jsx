import { useEffect, useMemo, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { categories, productsByCategory } from "../data/products.js";
import { useCart } from "../contexts/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import "../styles/categoryLegacy.css";

function CategoryLegacy({ slug }) {
  const navigate = useNavigate();
  const { addItem, removeItem, items, summary } = useCart();

  const { category, products } = useMemo(() => {
    const found = categories.find((item) => item.slug === slug);
    return {
      category: found,
      products: productsByCategory[slug] ?? [],
    };
  }, [slug]);

  // No in-page cart behavior: cart is managed globally by the Header / CartDrawer.

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const selectSize = (product) => product.sizes?.[0] ?? null;

  const handleCardClick = (product) => {
    addItem(product, selectSize(product));
    navigate("/checkout");
  };

  const handleRemoveItem = (id) => {
    removeItem(id);
  };

  const handleCheckout = () => {
    navigate("/pagamento");
  };

  return (
    <div className="category-legacy-page">
      <section className="category-legacy-page__hero">
        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </section>

      <section className="category-legacy-page__grid">
        {products.map((product) => (
          <article
            key={product.id}
            className="legacy-product-card"
            role="presentation"
            onClick={() => handleCardClick(product)}
          >
            <img src={product.image} alt={product.name} loading="lazy" />
            <h2>{product.name}</h2>
            <p className="legacy-product-card__price">{formatCurrency(product.price)}</p>
          </article>
        ))}
      </section>

      {/* Cart is accessible via the Header (CartDrawer). Removed in-page floating cart. */}
    </div>
  );
}

export default CategoryLegacy;
