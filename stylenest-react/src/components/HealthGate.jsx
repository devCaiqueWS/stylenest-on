import { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL } from "../data/products.js";

function HealthGate({ children, intervalMs = 120000 }) {
  const defaultHealthUrl = useMemo(() => {
    const custom = import.meta?.env?.VITE_HEALTH_URL;
    if (custom) return custom;
    const base = (API_BASE_URL || "").replace(/\/$/, "");
    return base ? `${base}/health` : "/api/health";
  }, []);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [apiDown, setApiDown] = useState(false);
  const timerRef = useRef(null);

  const checkHealth = async () => {
    try {
      setError(null);
      const resp = await fetch(defaultHealthUrl, { method: "GET" });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      // success
      setReady(true);
      setApiDown(false);
      return true;
    } catch (err) {
      if (!ready) {
        setError("Nao foi possivel conectar a API. Tente novamente.");
      } else {
        setApiDown(true);
      }
      return false;
    }
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
        <div style={{ opacity: 0.8 }}>Verificando disponibilidade da API…</div>
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
      {apiDown && (
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
          API instavel. Tentando reconectar…
        </div>
      )}
    </>
  );
}

export default HealthGate;

