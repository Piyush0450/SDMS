import { useState, useEffect, createContext, useContext } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase_config";
import { api } from "@/lib/api";
import { toast } from "sonner";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved = sessionStorage.getItem("sdms_session");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      sessionStorage.setItem("sdms_session", JSON.stringify(session));
    } else {
      sessionStorage.removeItem("sdms_session");
    }
  }, [session]);

  const loginWithCredentials = async (username, password) => {
    setLoading(true);
    try {
      const data = await api.post("/api/auth/login/credentials", { username, password });
      setSession(data);
      toast.success(`Welcome back, ${data.user?.name || data.user?.uid || "User"}!`);
      return data;
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const data = await api.post("/api/auth/login", { token: idToken });
      setSession(data);
      toast.success(`Signed in as ${data.user?.name || result.user.displayName}`);
      return data;
    } catch (err) {
      toast.error(err.message || "Google Sign-In failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setSession(null);
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ session, setSession, loading, loginWithCredentials, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
