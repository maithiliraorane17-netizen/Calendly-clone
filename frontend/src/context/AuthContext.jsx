import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api/services";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true on first load

  // On app start — check if token exists and fetch user
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      authAPI.getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => localStorage.removeItem("accessToken"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    setUser(res.data.user);
    return res.data;
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    setUser(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch (_) {}
    localStorage.removeItem("accessToken");
    setUser(null);
  }, []);

  const updateUser = useCallback((updated) => {
    setUser((prev) => ({ ...prev, ...updated }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
