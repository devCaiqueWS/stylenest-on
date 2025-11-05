import { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL } from "../data/products.js";

function HealthGate({ children, intervalMs = 120000 }) {
  const defaultHealthUrl = useMemo(() => {
    const custom = import.meta?.env?.VITE_HEALTH_URL;
    if (custom) return custom;
    const base = (API_BASE_URL || "").replace(/\/$/, "");
    return base ? `${base}/health` : "/api/health";
  }, []);

  const stripeHealthUrl = useMemo(() => {
    const base = (import.meta?.env?.VITE_PAYMENT_SERVER_URL || "").replace(/\/$/, "");
    if (!base) return null; // sem server explicitado, no checa Stripe
    return `${base}/api/health`;
  }, []);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [apiDown, setApiDown] = useState(false);
  const [stripeDown, setStripeDown] = useState(false);
  const timerRef = useRef(null);

  const checkHealth = async () => {
    let apiOk = false;
    let payOk = true; // assume true se no for obrigatorio checar

    // 1) API principal (obrigatorio)
    try {
      const resp = await fetch(defaultHealthUrl, { method: "GET" });
      apiOk = resp.ok;
    } catch (_) {
      apiOk = false;
    }

    // 2) Servidor de pagamento/Stripe (obrigatorio somente se VITE_PAYMENT_SERVER_URL estiver definido)
    if (stripeHealthUrl) {
      try {
        const resp = await fetch(stripeHealthUrl, { method: "GET" });
        payOk = resp.ok;
      } catch (_) {
        payOk = false;
      }
    }

    const allOk = apiOk && payOk;

    if (allOk) {
      setError(null);
      setReady(true);
      setApiDown(false);
      setStripeDown(false);
      return true;
    }

    // Atualiza estados de indisponibilidade para feedback
    if (!apiOk) setApiDown(true);
    if (stripeHealthUrl && !payOk) setStripeDown(true);

    if (!ready) {
      const msgs = [];
      if (!apiOk) msgs.push("API");
      if (stripeHealthUrl && !payOk) msgs.push("Stripe");
      setError(
        msgs.length > 0
          ? `Nao foi possivel conectar: ${msgs.join(" e ")}. Tente novamente.`
          : "Nao foi possivel conectar. Tente novamente."
      );
    }
    return false;
  };

  useEffect(() => {
    checkHealth();
    timerRef.current = setInterval(checkHealth, intervalMs);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs]);

  if (!ready) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        background: "#111",
        color: "#fff",
      }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Carregando a StyleNest…</div>
        <div style={{ opacity: 0.8 }}>
          Verificando disponibilidade da API{stripeHealthUrl ? " e do servidor de pagamento" : ""}…
        </div>
        {error && (
          <div style={{ color: "#ffdddd", background: "#3b1f1f", padding: 12, borderRadius: 8 }}>
            {error}
          </div>
        )}
        <button
          type="button"
          className="btn-border"
          onClick={checkHealth}
          style={{ padding: "10px 16px", borderRadius: 9999 }}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <>
      {children}
      {(apiDown || stripeDown) && (
        <div style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          background: "#fde2e2",
          color: "#c53030",
          padding: "10px 14px",
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
        }}>
          {apiDown && "API instavel. "}
          {stripeDown && "Servidor de pagamento instavel. "}
          Tentando reconectar…
        </div>
      )}
    </>
  );
}

export default HealthGate;
