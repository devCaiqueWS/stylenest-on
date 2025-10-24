import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";

function CartDrawer({ open, onClose }) {
  const { items, summary, removeItem } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <div className={`modal ${open ? "open" : ""}`} role="dialog" aria-modal="true">
      <div className="modal-content" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <h2>Seu Carrinho</h2>
        {items.length === 0 ? (
          <p style={{ marginTop: "16px" }}>Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "16px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "12px",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong>{item.name}</strong>
                    <div>{formatCurrency(item.price)}</div>
                    {item.size && (
                      <div style={{ fontSize: "14px", color: "#666" }}>Tamanho: {item.size}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    style={{ background: "#e74c3c", color: "#fff" }}
                    onClick={() => removeItem(item.id)}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
            <div style={{ fontWeight: 700, marginTop: "10px" }}>Total: {summary.formattedTotal}</div>
            <button
              type="button"
              className="botao-comprar-carrinho"
              style={{ marginTop: "20px" }}
              onClick={handleCheckout}
            >
              Finalizar compra
            </button>
          </>
        )}
        <button
          id="fechar-carrinho"
          className="btn-fechar"
          type="button"
          onClick={onClose}
          style={{ marginTop: "20px" }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

export default CartDrawer;
