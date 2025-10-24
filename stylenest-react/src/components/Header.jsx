import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { categories } from "../data/products.js";

const navLinkClass = ({ isActive }) =>
  `nav-link${isActive ? " active" : ""}`;

function Header({ onLoginClick, onRegisterClick, onCartClick }) {
  const { usuario, isAuthenticated, logout } = useAuth();
  const { summary } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="main-header">
      <div className="logo">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          STYLENEST
        </Link>
      </div>

      <nav className="nav-links">
        {categories.map((category) => (
          <NavLink key={category.slug} to={`/${category.slug}`} className={navLinkClass}>
            {category.name}
          </NavLink>
        ))}
      </nav>

      <div className="actions">
        {isAuthenticated ? (
          <div id="perfil-container" style={{ position: "relative" }}>
            <button id="btn-perfil" className="auth-btn" onClick={toggleMenu}>
              <span id="perfil-nome">
                {usuario?.nome ? `Olá, ${usuario.nome.split(" ")[0]}` : "Perfil"}
              </span>
            </button>
            {menuOpen && (
              <div
                id="menu-perfil"
                style={{
                  position: "absolute",
                  top: "48px",
                  right: 0,
                  background: "#ffffff",
                  border: "1px solid #000000",
                  borderRadius: "6px",
                  padding: "12px",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
                }}
              >
                <button
                  id="btn-sair"
                  style={{
                    background: "#e74c3c",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button onClick={onLoginClick} id="btn-login" className="auth-btn" type="button">
              Login
            </button>
            <button
              onClick={onRegisterClick}
              id="btn-register"
              className="auth-btn"
              type="button"
            >
              Cadastro
            </button>
          </>
        )}

        <button
          type="button"
          className="cart-icon"
          id="cart-icon"
          onClick={onCartClick}
          aria-label="Abrir carrinho"
        >
          🛒
          <span className="cart-count">{summary.count}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
