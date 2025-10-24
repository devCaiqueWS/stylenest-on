import { useMemo, useState } from "react";
import { useCart } from "../contexts/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "../components/StripePaymentForm.jsx";

const FRETE_FIXO = 19.9;
const DESCONTO_PIX = 0.05;

function Pagamento() {
  const { items, summary, clearCart } = useCart();
  const [metodo, setMetodo] = useState("cartao");
  const [mensagem, setMensagem] = useState(null);

  const totais = useMemo(() => {
    const subtotal = summary.total;
    const desconto = metodo === "pix" ? subtotal * DESCONTO_PIX : 0;
    const total = subtotal + FRETE_FIXO - desconto;
    return {
      subtotal,
      desconto,
      total,
    };
  }, [summary.total, metodo]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (items.length === 0) {
      setMensagem({ tipo: "erro", texto: "Adicione itens ao carrinho antes de pagar." });
      return;
    }
    // For card payments we render the Stripe Elements form instead of submitting here.
    // The StripePaymentForm component will call the server to create a PaymentIntent.

    // Fallback for other methods (pix)
    setMensagem({ tipo: "sucesso", texto: "Pagamento confirmado! Obrigado pela compra." });
    clearCart();
  };

  return (
    <div className="page-wrapper">
      <h2>Pagamento</h2>
      <p>Escolha a forma de pagamento preferida e finalize o seu pedido.</p>
      <div style={{ display: "grid", gap: "32px", gridTemplateColumns: "2fr 1fr" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="formas-pagamento">
            <label>
              <input
                type="radio"
                name="pagamento"
                value="cartao"
                checked={metodo === "cartao"}
                onChange={(event) => setMetodo(event.target.value)}
              />
              Cartão de crédito
            </label>
            <label>
              <input
                type="radio"
                name="pagamento"
                value="pix"
                checked={metodo === "pix"}
                onChange={(event) => setMetodo(event.target.value)}
              />
              Pix (5% de desconto)
            </label>
          </div>

          {metodo === "cartao" ? (
            (() => {
              const publishable = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
              if (!publishable) {
                return (
                  <div style={{ padding: 12, background: "#fff3cd", borderRadius: 8 }}>
                    <strong>Atenção:</strong> A chave pública da Stripe não está configurada. Defina
                    <code>VITE_STRIPE_PUBLISHABLE_KEY</code> em seu .env para testar o pagamento com cartão.
                  </div>
                );
              }

              const stripePromise = loadStripe(publishable);
              return (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    items={items.map((it) => ({ id: it.id, name: it.name, price: it.price, quantity: it.quantity || 1, image: it.image }))}
                    amount={totais.total}
                    onSuccess={(paymentIntent) => {
                      setMensagem({ tipo: "sucesso", texto: "Pagamento confirmado! Obrigado pela compra." });
                      clearCart();
                    }}
                    onError={(err) => {
                      setMensagem({ tipo: "erro", texto: err.message || "Erro no pagamento" });
                    }}
                  />
                </Elements>
              );
            })()
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              <label>
                CPF do titular
                <input placeholder="000.000.000-00" required />
              </label>
              <p style={{ fontSize: "14px", color: "#333" }}>
                Após confirmar, mostraremos o QR Code/Chave Pix para pagamento.
              </p>
            </div>
          )}

          {metodo !== "cartao" && (
            <button type="submit" className="primary">
              Confirmar pagamento
            </button>
          )}

          {mensagem && (
            <div
              style={{
                marginTop: "8px",
                padding: "12px",
                borderRadius: "8px",
                background: mensagem.tipo === "sucesso" ? "#d1fae5" : "#fde2e2",
                color: mensagem.tipo === "sucesso" ? "#047857" : "#c53030",
              }}
            >
              {mensagem.texto}
            </div>
          )}
        </form>

        <aside style={{ background: "#f7f7f7", padding: "20px", borderRadius: "12px" }}>
          <h3>Resumo do pedido</h3>
          {items.length === 0 ? (
            <p>Nenhum item selecionado.</p>
          ) : (
            <>
              <ul style={{ listStyle: "none", padding: 0, marginTop: "16px" }}>
                {items.map((item) => (
                  <li key={item.id} style={{ marginBottom: "12px" }}>
                    <strong>{item.name}</strong> — {formatCurrency(item.price)}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: "16px" }}>
                <div>Produtos: {formatCurrency(totais.subtotal)}</div>
                <div>Frete: {formatCurrency(FRETE_FIXO)}</div>
                {totais.desconto > 0 && <div>Desconto Pix: -{formatCurrency(totais.desconto)}</div>}
                <div style={{ fontWeight: 700, marginTop: "6px" }}>
                  Total a pagar: {formatCurrency(totais.total)}
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Pagamento;
