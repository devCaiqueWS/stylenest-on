import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-box">
        <h4>ATENDIMENTO</h4>
        <p>Segunda a Sexta - 8:00 às 17:00</p>
      </div>

      <div className="footer-contato">
        <h4>CONTATO</h4>
        <p>
          <a href="https://wa.me/5513997562876" target="_blank" rel="noreferrer">
            📱 WhatsApp
          </a>
        </p>
        <p>
          <a href="mailto:stylenestempresarial@gmail.com" target="_blank" rel="noreferrer">
            ✉️ E-mail
          </a>
        </p>
      </div>

      <div className="footer-links">
        <h4>INSTITUCIONAL</h4>
        <ul>
          <li>
            <Link to="/quem-somos">Quem Somos</Link>
          </li>
          <li>
            <Link to="/compra-segura">Compra Segura</Link>
          </li>
          <li>
            <Link to="/politica-privacidade">Política de Privacidade</Link>
          </li>
          <li>
            <Link to="/politica-troca">Política de Trocas</Link>
          </li>
        </ul>
      </div>

      <div className="footer-selos">
        <h4>SELOS DE SEGURANÇA</h4>
        <div className="selos">
          <a href="https://www.google.com" target="_blank" rel="noreferrer">
            Google
          </a>
          <a href="https://www.reclameaqui.com.br" target="_blank" rel="noreferrer">
            Selo Confiança
          </a>
          <a href="https://www.ssl.com" target="_blank" rel="noreferrer">
            Site Protegido
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
