import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { login as apiLogin } from "../api/client";

export interface AuthUser {
  id: string;
  username: string;
  role: "admin" | "investigator" | string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loginDemo: (role: "admin" | "investigator") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function userFromToken(token: string): AuthUser | null {
  const payload = parseJwt(token);
  if (!payload) return null;
  const role = payload.role || "investigator";
  return {
    id: payload.sub || "user",
    username: payload.username || payload.sub || "investigator@example.com",
    role,
    isAdmin: role === "admin",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("nexus_access_token"));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const existingToken = localStorage.getItem("nexus_access_token");
    return existingToken ? userFromToken(existingToken) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleLogout = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener("nexus:logout", handleLogout);
    return () => window.removeEventListener("nexus:logout", handleLogout);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const newToken = await apiLogin(username, password);
      setToken(newToken);
      const parsedUser = userFromToken(newToken);
      setUser(parsedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async (role: "admin" | "investigator") => {
    if (role === "admin") {
      await login("admin@system.local", "AdminPass123!");
    } else {
      await login("investigator@example.com", "demo-password");
    }
  };

  const logout = () => {
    localStorage.removeItem("nexus_access_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, loginDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
