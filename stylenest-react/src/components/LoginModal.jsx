import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

function LoginModal({ open, onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, senha });
      setEmail("");
      setSenha("");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal ${open ? "open" : ""}`} role="dialog" aria-modal="true">
      <div className="modal-content">
        <h2>Login</h2>
        <form id="form-login" onSubmit={handleSubmit}>
          <label htmlFor="login-email">E-mail</label>
          <input
            type="email"
            id="login-email"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="login-senha">Senha</label>
          <input
            type="password"
            id="login-senha"
            value={senha}
            required
            onChange={(event) => setSenha(event.target.value)}
          />

          {error && (
            <div style={{ color: "#e63946", fontSize: "14px", marginTop: "8px" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <button type="button" className="btn-fechar" onClick={onClose}>
            Fechar
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
