import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../contexts/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function Checkout() {
  const { items, summary, removeItem, clearCart } = useCart();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    complemento: "",
    cidade: "",
    estado: "",
    cep: "",
    pagamento: "cartao",
  });
  const [mensagem, setMensagem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) {
      return;
    }

    setMensagem({
      tipo: "sucesso",
      texto: "Pagamento confirmado com sucesso! Obrigado por escolher a StyleNest.",
    });
    clearCart();

    params.delete("session_id");
    const nextSearch = params.toString();
    const nextUrl = window.location.pathname + (nextSearch ? `?${nextSearch}` : "");
    window.history.replaceState({}, "", nextUrl);
  }, [clearCart]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensagem(null);

    if (items.length === 0) {
      setMensagem({ tipo: "erro", texto: "Adicione itens ao carrinho antes de finalizar." });
      return;
    }

    if (!publishableKey || !stripePromise) {
      setMensagem({
        tipo: "erro",
        texto: "Stripe nao configurado. Confirme a variavel VITE_STRIPE_PUBLISHABLE_KEY.",
      });
      return;
    }

    setIsLoading(true);
    const serverUrl = import.meta.env.VITE_PAYMENT_SERVER_URL || "http://localhost:4242";

    try {
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
          paymentMethod: formData.pagamento,
          customer: formData,
          successUrl: `${window.location.origin}/checkout?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar sessão de pagamento.");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Nao foi possivel inicializar o Stripe Checkout.");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId || data.id });
      if (error) {
        throw new Error(error.message);
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
  };

  return (
    <div className="page-wrapper checkout-page">
      <div className="checkout-header">
        <h2>Checkout</h2>
        <p>Revise seu pedido, informe os dados de entrega e finalize o pagamento pelo Stripe.</p>
      </div>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="checkout-section">
            <h3>Dados pessoais</h3>
            <div className="checkout-field">
              <label htmlFor="nome">Nome completo</label>
              <input id="nome" name="nome" value={formData.nome} onChange={handleChange} autoComplete="name" required />
            </div>
            <div className="checkout-field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
            <div className="checkout-field">
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </div>
          </section>

          <section className="checkout-section">
            <h3>Endereco de entrega</h3>
            <div className="checkout-field">
              <label htmlFor="endereco">Endereco</label>
              <input
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                autoComplete="street-address"
                required
              />
            </div>
            <div className="checkout-field">
              <label htmlFor="complemento">Complemento</label>
              <input
                id="complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                autoComplete="address-line2"
              />
            </div>
            <div className="checkout-field">
              <label htmlFor="cidade">Cidade</label>
              <input
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                autoComplete="address-level2"
                required
              />
            </div>
            <div className="checkout-field-grid">
              <div className="checkout-field">
                <label htmlFor="estado">Estado</label>
                <input
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  autoComplete="address-level1"
                  required
                />
              </div>
              <div className="checkout-field">
                <label htmlFor="cep">CEP</label>
                <input
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  autoComplete="postal-code"
                  required
                />
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <h3>Pagamento</h3>
            <div className="checkout-radio-group">
              <label className="checkout-radio">
                <input
                  type="radio"
                  name="pagamento"
                  value="cartao"
                  checked={formData.pagamento === "cartao"}
                  onChange={handleChange}
                />
                Cartao de credito (Stripe)
              </label>
              <label className="checkout-radio">
                <input
                  type="radio"
                  name="pagamento"
                  value="pix"
                  checked={formData.pagamento === "pix"}
                  onChange={handleChange}
                />
                Pix via Stripe
              </label>
            </div>
            <p className="checkout-note">
              {formData.pagamento === "pix"
                ? "Ao continuar, geraremos um QR Code Pix pelo Stripe. Tenha o aplicativo do seu banco por perto."
                : "Ao continuar, voce sera redirecionado para concluir o pagamento com seguranca pelo Stripe."}
            </p>
          </section>

          <button type="submit" className="primary checkout-submit" disabled={isLoading}>
            {isLoading ? "Redirecionando..." : "Finalizar compra com Stripe"}
          </button>

          {mensagem && <div className={`checkout-message ${mensagem.tipo}`}>{mensagem.texto}</div>}
        </form>

        <aside className="checkout-summary">
          <h3>Resumo do pedido</h3>
          {items.length === 0 ? (
            <p>Seu carrinho esta vazio.</p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-item-info">
                    <strong>{item.name}</strong>
                    <span>{formatCurrency(item.price)}</span>
                    {item.size && <span className="checkout-item-size">Tam. {item.size}</span>}
                  </div>
                  <button type="button" className="btn-border" onClick={() => removeItem(item.id)}>
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="checkout-total">Total: {summary.formattedTotal}</div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
