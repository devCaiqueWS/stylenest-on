import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import ProductDetailModal from "./ProductDetailModal.jsx";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState("buy");

  const requiresSize = product.sizes && product.sizes.length > 0;

  const openDetails = (event, action = "buy") => {
    event.stopPropagation();
    setPendingAction(action);
    setSelectedSize(null);
    setDetailOpen(true);
  };

  const handleAddToCart = (event) => openDetails(event, "cart");
  const handleBuyNow = (event) => openDetails(event, "buy");

  const handleClose = () => {
    setDetailOpen(false);
    setPendingAction("buy");
    setSelectedSize(null);
  };

  const handleConfirmAdd = () => {
    if (requiresSize && !selectedSize) {
      return;
    }
    addItem(product, selectedSize || null);
    handleClose();
  };

  const handleConfirmBuy = () => {
    if (requiresSize && !selectedSize) {
      return;
    }
    addItem(product, selectedSize || null);
    handleClose();
    navigate("/checkout");
  };

  return (
    <>
      <div className="product-card" role="button" onClick={(event) => openDetails(event, "buy")}>
        <img src={product.image} alt={product.name} loading="lazy" />
        <div className="product-info">
          <h4>{product.name}</h4>
          {product.description && <p>{product.description}</p>}
          <div className="price">{formatCurrency(product.price)}</div>

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
      <ProductDetailModal
        product={product}
        open={detailOpen}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onClose={handleClose}
        onAddToCart={handleConfirmAdd}
        onBuyNow={handleConfirmBuy}
        defaultAction={pendingAction}
      />
    </>
  );
}

export default ProductCard;
