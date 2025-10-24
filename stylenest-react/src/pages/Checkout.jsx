import { useState } from "react";
import { useCart } from "../contexts/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (items.length === 0) {
      setMensagem({ tipo: "erro", texto: "Adicione itens ao carrinho antes de finalizar." });
      return;
    }
    setMensagem({ tipo: "sucesso", texto: "Compra realizada com sucesso! Obrigado por escolher a StyleNest." });
    clearCart();
  };

  return (
    <div className="page-wrapper">
      <h2>Checkout</h2>
      <p>Revise seu pedido e informe os dados para entrega e pagamento.</p>

      <div style={{ display: "grid", gap: "32px", gridTemplateColumns: "2fr 1fr" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h3>Dados Pessoais</h3>
            <label>
              Nome completo
              <input name="nome" value={formData.nome} onChange={handleChange} required />
            </label>
            <label>
              E-mail
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
            <label>
              Telefone
              <input name="telefone" value={formData.telefone} onChange={handleChange} required />
            </label>
          </div>

          <div>
            <h3>Endereço de entrega</h3>
            <label>
              Endereço
              <input name="endereco" value={formData.endereco} onChange={handleChange} required />
            </label>
            <label>
              Complemento
              <input name="complemento" value={formData.complemento} onChange={handleChange} />
            </label>
            <label>
              Cidade
              <input name="cidade" value={formData.cidade} onChange={handleChange} required />
            </label>
            <label>
              Estado
              <input name="estado" value={formData.estado} onChange={handleChange} required />
            </label>
            <label>
              CEP
              <input name="cep" value={formData.cep} onChange={handleChange} required />
            </label>
          </div>

          <div>
            <h3>Pagamento</h3>
            <label>
              <input
                type="radio"
                name="pagamento"
                value="cartao"
                checked={formData.pagamento === "cartao"}
                onChange={handleChange}
              />
              Cartão de crédito
            </label>
            <label>
              <input
                type="radio"
                name="pagamento"
                value="pix"
                checked={formData.pagamento === "pix"}
                onChange={handleChange}
              />
              Pix (5% off)
            </label>
          </div>

          <button type="submit" className="primary">
            Finalizar compra
          </button>

          {mensagem && (
            <div
              style={{
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
            <p>Seu carrinho está vazio.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, marginTop: "16px" }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "12px",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "12px",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "64px", height: "64px", borderRadius: "8px", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong>{item.name}</strong>
                    <div>{formatCurrency(item.price)}</div>
                    {item.size && <div style={{ fontSize: "14px", color: "#666" }}>Tam. {item.size}</div>}
                  </div>
                  <button type="button" className="btn-border" onClick={() => removeItem(item.id)}>
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div style={{ fontWeight: 700, marginTop: "16px" }}>Total: {summary.formattedTotal}</div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
