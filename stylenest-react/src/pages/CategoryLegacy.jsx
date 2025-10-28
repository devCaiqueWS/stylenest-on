import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { categories } from "../data/products.js";
import { useCategoryProducts } from "../hooks/useCategoryProducts.js";
import { useCart } from "../contexts/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import ProductDetailModal from "../components/ProductDetailModal.jsx";
import "../styles/categoryLegacy.css";

function CategoryLegacy({ slug }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [defaultAction, setDefaultAction] = useState("buy");

  const category = useMemo(() => categories.find((item) => item.slug === slug), [slug]);
  const { products, loading, error } = useCategoryProducts(slug);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }
    const updatedProduct = products.find((product) => product.id === selectedProduct.id);
    if (!updatedProduct) {
      setSelectedProduct(null);
      setSelectedSize(null);
      return;
    }
    if (updatedProduct !== selectedProduct) {
      setSelectedProduct(updatedProduct);
    }
  }, [products, selectedProduct]);

  useEffect(() => {
    if (!selectedProduct || !selectedSize) {
      return;
    }
    if (!Array.isArray(selectedProduct.sizes) || !selectedProduct.sizes.includes(selectedSize)) {
      setSelectedSize(null);
    }
  }, [selectedProduct, selectedSize]);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const requiresSize = selectedProduct?.sizes && selectedProduct.sizes.length > 0;

  const openModal = (product, action = "buy") => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setDefaultAction(action);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedSize(null);
    setDefaultAction("buy");
  };

  const handleAddToCart = () => {
    if (!selectedProduct || (requiresSize && !selectedSize)) {
      return;
    }
    addItem(selectedProduct, selectedSize || null);
    closeModal();
  };

  const handleBuyNow = () => {
    if (!selectedProduct || (requiresSize && !selectedSize)) {
      return;
    }
    addItem(selectedProduct, selectedSize || null);
    closeModal();
    navigate("/checkout");
  };

  return (
    <div className="category-legacy-page">
      <section className="category-legacy-page__hero">
        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </section>

      <section className="category-legacy-page__grid">
        {loading && (
          <p className="category-legacy-page__status" aria-live="polite">
            Carregando produtos...
          </p>
        )}
        {!loading && error && (
          <p
            className="category-legacy-page__status category-legacy-page__status--error"
            role="status"
          >
            {error}
          </p>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="category-legacy-page__status" aria-live="polite">
            Nenhum produto disponivel no momento.
          </p>
        )}
        {!loading && !error &&
          products.map((product) => (
            <article
              key={product.id}
              className="legacy-product-card"
              role="presentation"
              onClick={() => openModal(product, "buy")}
            >
              <img src={product.image} alt={product.name} loading="lazy" />
              <h2>{product.name}</h2>
              <p className="legacy-product-card__price">{formatCurrency(product.price)}</p>
            </article>
          ))}
      </section>

      <ProductDetailModal
        product={selectedProduct}
        open={Boolean(selectedProduct)}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onClose={closeModal}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        defaultAction={defaultAction}
      />
    </div>
  );
}

export default CategoryLegacy;
