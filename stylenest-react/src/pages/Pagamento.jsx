import { useMemo, useState } from "react";
import { useCart } from "../contexts/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";

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
    if (metodo === "cartao") {
      // Create a Stripe Checkout session on the test server and redirect
      const serverUrl = import.meta.env.VITE_PAYMENT_SERVER_URL || "http://localhost:4242";
      fetch(`${serverUrl.replace(/\/$/, "")}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((it) => ({ id: it.id, name: it.name, price: it.price, quantity: 1, image: it.image })),
          successUrl: window.location.origin + "/pagamento?session_id={CHECKOUT_SESSION_ID}",
          cancelUrl: window.location.origin + "/pagamento",
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.url) {
            window.location.href = data.url;
          } else {
            setMensagem({ tipo: "erro", texto: data.error || "Erro ao criar sessão de pagamento." });
          }
        })
        .catch((err) => {
          console.error(err);
          setMensagem({ tipo: "erro", texto: "Erro ao conectar com o servidor de pagamento." });
        });
      return;
    }

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
            <div style={{ display: "grid", gap: "12px" }}>
              <label>
                Número do cartão
                <input placeholder="0000 0000 0000 0000" required />
              </label>
              <label>
                Nome impresso
                <input required />
              </label>
              <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(2, 1fr)" }}>
                <label>
                  Validade (MM/AA)
                  <input placeholder="MM/AA" required />
                </label>
                <label>
                  CVV
                  <input placeholder="123" required />
                </label>
              </div>
            </div>
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

          <button type="submit" className="primary">
            Confirmar pagamento
          </button>

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
