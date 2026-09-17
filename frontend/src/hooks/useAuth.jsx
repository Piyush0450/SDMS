import { useState, useEffect, createContext, useContext } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase_config";
import { api } from "@/lib/api";
import { toast } from "sonner";

const AuthContext = createContext(null);
const IS_DEBUG = import.meta.env.VITE_DEBUG_AUTH === "true";

function formatSession(data) {
  if (!data || data.ok === false) return null;
  const uid = data.id || data.u_id || data.user?.uid || data.user?.id || "";
  const role = data.role || data.user?.role || "student";
  const email = data.email || data.user?.email || "";
  const token = data.token || data.user?.token || "dev-token";
  const name = data.name || data.user?.name || uid;

  const sessionObj = {
    ...data,
    ok: true,
    id: uid,
    u_id: uid,
    role,
    email,
    token,
    name,
    user: {
      id: uid,
      u_id: uid,
      uid,
      role,
      email,
      name,
      token,
    },
  };

  if (IS_DEBUG) {
    console.log("[AUTH DEBUG] Formatted Session Object:", sessionObj);
  }

  return sessionObj;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("sdms_session") || sessionStorage.getItem("sdms_session");
    if (!saved) return null;
    try {
      return formatSession(JSON.parse(saved));
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      localStorage.setItem("sdms_session", JSON.stringify(session));
    } else {
      localStorage.removeItem("sdms_session");
      sessionStorage.removeItem("sdms_session");
    }
  }, [session]);

  const loginWithCredentials = async (username, password) => {
    setLoading(true);
    try {
      const data = await api.post("/api/auth/login/credentials", { username, password });
      const formatted = formatSession(data);
      setSession(formatted);
      toast.success(`Welcome back, ${formatted?.user?.name || username}!`);
      return formatted;
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
      const formatted = formatSession({ ...data, token: idToken, name: data.name || result.user.displayName });
      setSession(formatted);
      toast.success(`Signed in as ${formatted?.user?.name || result.user.displayName}`);
      return formatted;
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

