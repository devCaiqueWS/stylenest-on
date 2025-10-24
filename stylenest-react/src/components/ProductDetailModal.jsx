import { useMemo } from "react";
import { formatCurrency } from "../utils/formatCurrency.js";

const FALLBACK_REVIEWS = [
  {
    id: "review-1",
    rating: 5,
    comment: "Excelente qualidade e caimento impecável. Tecido leve e confortável.",
  },
  {
    id: "review-2",
    rating: 4,
    comment: "Gostei muito, só achei o tamanho um pouco pequeno. Recomendo comprar um número acima.",
  },
];

function ProductDetailModal({
  product,
  open,
  selectedSize,
  onSelectSize,
  onClose,
  onAddToCart,
  onBuyNow,
  defaultAction = "buy",
}) {
  const requiresSize = useMemo(() => product?.sizes && product.sizes.length > 0, [product]);
  const canProceed = !requiresSize || Boolean(selectedSize);
  const reviews = useMemo(() => {
    if (!product) {
      return [];
    }
    if (Array.isArray(product.reviews) && product.reviews.length > 0) {
      return product.reviews;
    }
    return FALLBACK_REVIEWS;
  }, [product]);

  if (!product) {
    return null;
  }

  return (
    <div
      className={`modal product-detail-modal ${open ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="modal-content product-detail-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" aria-label="Fechar" onClick={onClose}>
          &times;
        </button>

        <div className="product-detail-body">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-detail-info">
            <h2>{product.name}</h2>
            <div className="product-detail-price">{formatCurrency(product.price)}</div>
            {product.description && <p className="product-detail-description">{product.description}</p>}

            {requiresSize && (
              <div className="product-detail-sizes">
                <span>Selecione o tamanho</span>
                <div className="product-detail-size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={size === selectedSize ? "active" : ""}
                      onClick={() => onSelectSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && <small className="product-detail-warning">Escolha um tamanho para continuar.</small>}
              </div>
            )}
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="product-detail-reviews">
            <h4>Avaliações</h4>
            <ul>
              {reviews.map((review) => (
                <li key={review.id || review.comment}>
                  <div className="product-detail-rating">
                    <span aria-hidden="true">★★★★★</span>
                    <span className="sr-only">{review.rating} de 5 estrelas</span>
                  </div>
                  <p>{review.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="product-detail-actions">
          <button
            type="button"
            className={`btn-border ${defaultAction === "cart" ? "preferred" : ""}`}
            onClick={onAddToCart}
            disabled={!canProceed}
          >
            Adicionar ao carrinho
          </button>
          <button
            type="button"
            className={`primary ${defaultAction === "buy" ? "preferred" : ""}`}
            onClick={onBuyNow}
            disabled={!canProceed}
          >
            Comprar agora
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
