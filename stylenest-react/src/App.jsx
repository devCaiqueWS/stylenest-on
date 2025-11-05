import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import LoginModal from "./components/LoginModal.jsx";
import RegisterModal from "./components/RegisterModal.jsx";
import Home from "./pages/Home.jsx";
import Homem from "./pages/Homem.jsx";
import Mulher from "./pages/Mulher.jsx";
import Kids from "./pages/Kids.jsx";
import CompraSegura from "./pages/CompraSegura.jsx";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade.jsx";
import PoliticaTroca from "./pages/PoliticaTroca.jsx";
import QuemSomos from "./pages/QuemSomos.jsx";
import Checkout from "./pages/Checkout.jsx";
import Pagamento from "./pages/Pagamento.jsx";
import NotFound from "./pages/NotFound.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import HealthGate from "./components/HealthGate.jsx";

function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  // Cart is centralized in the Header (CartDrawer). Header's cart button will open CartDrawer.
  const handleCartClick = useCallback(() => {
    setCartOpen(true);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <HealthGate>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header
              onLoginClick={() => setLoginOpen(true)}
              onRegisterClick={() => setRegisterOpen(true)}
              onCartClick={handleCartClick}
            />

            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mulher" element={<Mulher />} />
                <Route path="/homem" element={<Homem />} />
                <Route path="/kids" element={<Kids />} />
                <Route path="/compra-segura" element={<CompraSegura />} />
                <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
                <Route path="/politica-troca" element={<PoliticaTroca />} />
                <Route path="/quem-somos" element={<QuemSomos />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/pagamento" element={<Pagamento />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>

            <Footer />

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
            <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
          </div>
        </HealthGate>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
