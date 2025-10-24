import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page-wrapper" style={{ textAlign: "center" }}>
      <h2>Página não encontrada</h2>
      <p>O conteúdo que você procura pode ter sido movido ou removido.</p>
      <Link to="/" className="auth-btn">
        Voltar para a página inicial
      </Link>
    </div>
  );
}

export default NotFound;
