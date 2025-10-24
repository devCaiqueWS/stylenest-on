import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../data/products.js";

const AuthContext = createContext();

const STORAGE_KEY = "stylenest-auth";

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Erro ao ler autenticação", error);
    }
    return { token: null, usuario: null };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Erro ao salvar autenticação", error);
    }
  }, [state]);

  const login = async ({ email, senha }) => {
    const resposta = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => ({}));
      throw new Error(erro.message || erro.mensagem || "Falha no login");
    }

    const dados = await resposta.json();
    setState({ token: dados.token, usuario: dados.usuario });
    return dados;
  };

  const register = async ({ nome, email, senha }) => {
    const resposta = await fetch(`${API_BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => ({}));
      throw new Error(erro.message || erro.mensagem || "Falha no cadastro");
    }

    return resposta.json();
  };

  const logout = () => {
    setState({ token: null, usuario: null });
  };

  const value = useMemo(
    () => ({
      token: state.token,
      usuario: state.usuario,
      isAuthenticated: Boolean(state.token),
      login,
      register,
      logout,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
