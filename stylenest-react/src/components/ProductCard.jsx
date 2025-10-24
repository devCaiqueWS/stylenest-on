import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? null);

  const handleAddToCart = (event) => {
    event.stopPropagation();
    addItem(product, selectedSize || null);
  };

  const handleBuyNow = (event) => {
    event.stopPropagation();
    addItem(product, selectedSize || null);
    navigate("/checkout");
  };

  return (
    <div className="product-card" role="button" onClick={handleBuyNow}>
      <img src={product.image} alt={product.name} loading="lazy" />
      <div className="product-info">
        <h4>{product.name}</h4>
        {product.description && <p>{product.description}</p>}
        <div className="price">{formatCurrency(product.price)}</div>

        {product.sizes && product.sizes.length > 0 && (
          <div className="size-selector" onClick={(event) => event.stopPropagation()}>
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={size === selectedSize ? "active" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <div className="product-actions" onClick={(event) => event.stopPropagation()}>
          <button type="button" className="btn-border" onClick={handleAddToCart}>
            Adicionar ao carrinho
          </button>
          <button type="button" className="primary" onClick={handleBuyNow}>
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
