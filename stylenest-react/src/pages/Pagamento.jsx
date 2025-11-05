import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../contexts/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import { API_BASE_URL } from "../data/products.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const FRETE_FIXO = 19.9;
const DESCONTO_PIX = 0.05;
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function Pagamento() {
  const { items, summary, clearCart } = useCart();
  const { token } = useAuth();
  const [metodo, setMetodo] = useState("cartao");
  const [mensagem, setMensagem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const totais = useMemo(() => {
    const subtotal = summary.total;
    const desconto = metodo === "pix" ? subtotal * DESCONTO_PIX : 0;
    const total = subtotal + FRETE_FIXO - desconto;
    return { subtotal, desconto, total };
  }, [summary.total, metodo]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) {
      return;
    }
    setMensagem({ tipo: "sucesso", texto: "Pagamento confirmado! Obrigado pela compra." });
    clearCart();
    params.delete("session_id");
    const nextSearch = params.toString();
    const nextUrl = window.location.pathname + (nextSearch ? `?${nextSearch}` : "");
    window.history.replaceState({}, "", nextUrl);
  }, [clearCart]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensagem(null);

    if (items.length === 0) {
      setMensagem({ tipo: "erro", texto: "Adicione itens ao carrinho antes de pagar." });
      return;
    }

    if (metodo === "cartao") {
      if (!publishableKey) {
        setMensagem({
          tipo: "erro",
          texto: "Chave publica da Stripe ausente. Verifique sua configuracao.",
        });
        return;
      }

      setIsLoading(true);
      const serverUrl = import.meta.env.VITE_PAYMENT_SERVER_URL || "http://localhost:4242";
      const ordersApiUrl = (import.meta.env.VITE_ORDERS_API_URL || API_BASE_URL || "").replace(/\/$/, "");

      // Pre-register order (pending) before redirecting to Stripe — mandatory
      const preRegisterOrder = async () => {
        if (!ordersApiUrl) {
          throw new Error(
            "Configuração ausente: defina VITE_ORDERS_API_URL ou API_BASE_URL para criar o pedido."
          );
        }

        const payload = {
          status: "pending",
          paymentMethod: "cartao",
          total: summary.total,
          itens: items.map((it) => ({
            id: it.id,
            productId: it.productId,
            nome: it.name,
            preco: it.price,
            quantidade: 1,
            tamanho: it.size || null,
            imagem: it.image,
          })),
        };

        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const resposta = await fetch(`${ordersApiUrl}/pedidos`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        const dados = await resposta.json().catch(() => ({}));
        if (!resposta.ok) {
          throw new Error(dados.message || dados.mensagem || "Falha ao criar pedido");
        }
        const createdId =
          dados.id || dados.pedidoId || dados.orderId || dados._id || dados.codigo || null;
        if (!createdId) {
          throw new Error("A API não retornou o identificador do pedido.");
        }
        return createdId;
      };

      try {
        const orderId = await preRegisterOrder();
        if (!orderId) {
          throw new Error("Não foi possível criar o pedido. Tente novamente.");
        }
        const response = await fetch(`${serverUrl.replace(/\/$/, "")}/create-checkout-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((it) => ({
              id: it.id,
              name: it.name,
              price: it.price,
              quantity: 1,
              image: it.image,
            })),
            orderId,
            successUrl: `${window.location.origin}/pagamento?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/pagamento`,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Erro ao criar sessao de pagamento.");
        }

        if (data.sessionId && stripePromise) {
          const stripe = await stripePromise;
          if (!stripe) {
            throw new Error("Nao foi possivel inicializar o Stripe Checkout.");
          }
          const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
          if (error) {
            throw new Error(error.message);
          }
        } else if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error(data.error || "Erro ao criar sessao de pagamento.");
        }
      } catch (error) {
        console.error(error);
        setMensagem({
          tipo: "erro",
          texto: error.message || "Erro ao conectar com o servidor de pagamento.",
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

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
              Cartao de credito
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
              <p style={{ fontSize: "14px", color: "#333" }}>
                Voce sera redirecionado para o Stripe Checkout para concluir o pagamento com cartao.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              <label>
                CPF do titular
                <input placeholder="000.000.000-00" required />
              </label>
              <p style={{ fontSize: "14px", color: "#333" }}>
                Apos confirmar, mostraremos o QR Code ou chave Pix para pagamento.
              </p>
            </div>
          )}

          <button type="submit" className="primary" disabled={isLoading}>
            {metodo === "cartao" ? (isLoading ? "Redirecionando..." : "Pagar com Stripe") : "Confirmar pagamento"}
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
                    <strong>{item.name}</strong> - {formatCurrency(item.price)}
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
