import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

function RegisterModal({ open, onClose }) {
  const { register } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (senha !== confirmar) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      setLoading(true);
      await register({ nome, email, senha });
      setSuccess("Cadastro realizado! Faça seu login.");
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmar("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal ${open ? "open" : ""}`} role="dialog" aria-modal="true">
      <div className="modal-content">
        <h2>Cadastro</h2>
        <form id="form-register" onSubmit={handleSubmit}>
          <label htmlFor="register-nome">Nome</label>
          <input
            type="text"
            id="register-nome"
            value={nome}
            required
            onChange={(event) => setNome(event.target.value)}
          />

          <label htmlFor="register-email">E-mail</label>
          <input
            type="email"
            id="register-email"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="register-senha">Senha</label>
          <input
            type="password"
            id="register-senha"
            value={senha}
            required
            onChange={(event) => setSenha(event.target.value)}
          />

          <label htmlFor="register-confirmar">Confirmar Senha</label>
          <input
            type="password"
            id="register-confirmar"
            value={confirmar}
            required
            onChange={(event) => setConfirmar(event.target.value)}
          />

          {error && (
            <div style={{ color: "#e63946", fontSize: "14px", marginTop: "8px" }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ color: "#2a9d8f", fontSize: "14px", marginTop: "8px" }}>
              {success}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Cadastrar"}
          </button>
          <button type="button" className="btn-fechar" onClick={onClose}>
            Fechar
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
