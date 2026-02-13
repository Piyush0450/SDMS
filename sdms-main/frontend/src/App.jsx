import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn, ChevronDown, Shield, User, Users, GraduationCap,
  ClipboardCheck, BarChart3, BookOpen, PlusCircle, Settings, Sun, Moon,
  Menu, X, Edit, Trash2, LogOut, FileText
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend
} from 'recharts';
import { ThemeProvider, useTheme } from "./ThemeContext";
import { Toaster, toast } from 'react-hot-toast';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase_config";
import { StudentDashboard, TeacherDashboard, AdminDashboard } from './DashboardWidgets';
import AdminReports from './AdminReports';
import UserManagement from './UserManagement';


const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  FACULTY: "faculty",
  STUDENT: "student",
};

const Container = ({ children }) => (
  // Enhanced background with gradient mesh effect
  <div className="min-h-screen min-w-[100vw] w-fit sm:w-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
    {children}
  </div>
);

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-white/50 backdrop-blur border border-white/20 hover:bg-white/80 transition dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:border-slate-700"
      title="Toggle Theme"
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
};

// Navbar Simplified - No Role Dropdown needed for login
const Navbar = ({ onLoginClick, onMenuClick, onHomeClick, session, onLogout, onDashboardClick }) => (
  <nav className="sticky top-0 z-50 glass border-b-0">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300">
            <Menu className="h-6 w-6" />
          </button>
        )}
        <button onClick={onHomeClick} className="flex items-center gap-3 hover:opacity-80 transition group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-shadow">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-extrabold tracking-tight text-xl dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
            SDMS Portal
          </span>
        </button>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {session ? (
          <div className="flex items-center gap-2">
            {onDashboardClick && (
              <button onClick={onDashboardClick} className="hidden sm:flex items-center gap-2 bg-indigo-600/10 text-indigo-600 px-4 py-2 rounded-xl font-semibold hover:bg-indigo-600/20 transition dark:text-indigo-400 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20">
                <BarChart3 className="h-4 w-4" /> Dashboard
              </button>
            )}
            <button onClick={onLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100 font-semibold text-sm flex items-center gap-2 hover:bg-red-100 transition dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20 dark:hover:bg-red-900/20">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="group flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all dark:bg-white dark:text-slate-900"
          >
            <span className="font-semibold">Login</span>
            <LogIn className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  </nav>
);

const SectionCard = ({ title, icon, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass-card p-6 rounded-2xl ${className}`}
  >
    <div className="flex items-center gap-3 mb-5">
      <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
        {React.cloneElement(icon, { className: "h-5 w-5" })}
      </div>
      <h3 className="font-bold text-lg dark:text-slate-100">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const Home = ({ onLogin, onHomeClick, session, onLogout, onDashboardClick }) => (
  <Container>
    <Navbar onLoginClick={onLogin} onHomeClick={onHomeClick} session={session} onLogout={onLogout} onDashboardClick={onDashboardClick} />
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium text-sm dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300"
        >
          ✨ New: Google Sign-In Enabled
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-7xl font-extrabold tracking-tight dark:text-white mb-6"
        >
          Welcome to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
            SDMS Portal
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          A next-generation Student Data Management System. <br />
          Secure, fast, and beautifully designed for every role.
        </motion.p>

        {!session && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <button onClick={onLogin} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all">
              Get Started <LogIn className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:bg-purple-900/30"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:bg-indigo-900/30"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:bg-pink-900/30"></div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-24 relative z-10">
        <SectionCard title="Secure Access" icon={<Shield />}>
          Enterprise-grade security with role-based permissions for Admins, Faculty, and Students using Google Auth.
        </SectionCard>
        <SectionCard title="Smart Dashboard" icon={<BarChart3 />}>
          Real-time analytics and intuitive tools tailored to your specific academic needs.
        </SectionCard>
        <SectionCard title="Seamless Experience" icon={<ZapIcon />}>
          Lightning fast performance with a modern glassmorphism interface that's easy on the eyes.
        </SectionCard>
      </div>
    </main>
  </Container>
);

const ZapIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
)


const Input = ({ label, value, onChange, placeholder, disabled, type = "text", ...rest }) => (
  <label className="block">
    <span className="block text-sm font-medium mb-1.5 dark:text-slate-300">{label}</span>
    <input
      type={type}
      disabled={disabled}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      className={`w-full rounded-xl px-4 py-3 text-base md:text-sm glass-input placeholder-slate-400 ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      {...rest}
    />
  </label>
);

const PrimaryBtn = ({ children, onClick, type = "button", className = "" }) => (
  <button type={type} onClick={onClick} className={`btn-primary ${className}`}>
    {children}
  </button>
);

const AuthPanel = ({ onLoggedIn, onHomeClick }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState("email"); // Default to Email (Firebase)

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      // Verify with backend
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (data.ok) {
        toast.success(`Welcome back, ${data.email}!`);
        onLoggedIn({ role: data.role, id: data.id, email: data.email, token: data.token });
      } else {
        setError(data.error || "Authentication failed.");
        toast.error(data.error || "Login Failed");
        await auth.signOut();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Google Sign-In failed.");
      toast.error("Google Sign-In failed");
    } finally {
      setLoading(false);
    }
  };

  const [uid, setUid] = useState("");
  const [dob, setDob] = useState("");

  const handleUidLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uid, password: dob }) // Backend expects username/password
      });

      const data = await res.json();

      if (data.ok) {
        toast.success(`Welcome back!`);
        onLoggedIn({ role: data.role, id: data.id, email: data.email, token: data.token });
      } else {
        setError(data.error || "Invalid credentials");
        toast.error(data.error || "Login Failed");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Navbar onLoginClick={() => { }} onHomeClick={onHomeClick} />
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 sm:p-10 rounded-3xl relative overflow-hidden">
            {/* Decorative Top Gradient */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 shadow-inner dark:bg-indigo-900/30 dark:text-indigo-400">
                <LogIn className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold mb-2 dark:text-white">Sign In</h2>
              <p className="text-slate-500 dark:text-slate-400">Access your SDMS Dashboard</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-start gap-2 dark:bg-red-900/10 dark:text-red-300 dark:border-red-900/20">
                <Shield className="h-5 w-5 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Login Mode Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setLoginMode("email")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${loginMode === "email"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
              >
                Login with Email
              </button>
              <button
                onClick={() => setLoginMode("uid")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${loginMode === "uid"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
              >
                Login with UID
              </button>
            </div>

            {loginMode === "email" ? (
              <div className="space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full relative flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-semibold py-3.5 px-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group disabled:opacity-70 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-750"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
                      <span>Log in with Email (Firebase)</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                  Protected by Firebase Authentication.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUidLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    User UID
                  </label>
                  <input
                    type="text"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    placeholder="e.g., F_001, S_001, A_001"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Date of Birth (Password)
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            )}

            {/* DEV LOGIN BYPASS */}
            <div className="mt-6 border-t pt-4 border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  const header = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0";
                  const payload = btoa(JSON.stringify({ email: "piyushchaurasiya348@gmail.com" })); // Auto-admin
                  const token = `${header}.${payload}.`;

                  fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.ok) {
                        toast.success(`DEV LOGIN: Welcome ${data.email}`);
                        onLoggedIn({ role: data.role, id: data.id, email: data.email });
                      } else {
                        setError(data.error);
                        toast.error(data.error);
                      }
                    })
                    .catch(err => {
                      console.error(err);
                      toast.error("Dev Login Failed");
                    });
                }}
                className="w-full py-2 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-lg hover:bg-yellow-200 transition opacity-50 hover:opacity-100"
              >
                ⚠️ DEV LOGIN (Super Admin)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
};

/* -------------------------------------------------------------------------- */
/*                           Dashboard Components                             */
/* -------------------------------------------------------------------------- */

const DashboardLayout = ({ role, userId, onLogout, children, ...rest }) => {
  const menu = useMemo(() => {
    if (role === ROLES.SUPER_ADMIN) {
      return [
        { key: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
        { key: "admins", label: "Manage Roles", icon: <Shield className="h-4 w-4" /> },

        { key: "reports", label: "Reports", icon: <ClipboardCheck className="h-4 w-4" /> },
        { key: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
      ];
    }
    if (role === ROLES.ADMIN) {
      return [
        { key: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
        { key: "faculty", label: "Faculty", icon: <Users className="h-4 w-4" /> },
        { key: "students", label: "Students", icon: <GraduationCap className="h-4 w-4" /> },
        { key: "reports", label: "Reports", icon: <ClipboardCheck className="h-4 w-4" /> },
      ];
    }
    if (role === ROLES.FACULTY) {
      return [
        { key: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
        { key: "mark", label: "Mark Attendance", icon: <ClipboardCheck className="h-4 w-4" /> },
        { key: "students", label: "Student List", icon: <Users className="h-4 w-4" /> },
        { key: "results", label: "Results", icon: <BookOpen className="h-4 w-4" /> },
      ];
    }

    return [
      { key: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
      { key: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
      { key: "attendance", label: "Attendance", icon: <ClipboardCheck className="h-4 w-4" /> },
      { key: "results", label: "Results", icon: <BookOpen className="h-4 w-4" /> },
    ];
  }, [role]);

  const [active, setActive] = useState(menu[0]?.key ?? "overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Container>
      <Navbar onLoginClick={() => { }} onMenuClick={() => setSidebarOpen(true)} onHomeClick={rest.onHomeClick} session={{ role, id: userId }} onLogout={onLogout} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-6 relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white dark:bg-slate-900 z-50 p-6 shadow-2xl md:hidden border-r dark:border-slate-800"
              >
                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-xl dark:text-white">Menu</span>
                  <button onClick={() => setSidebarOpen(false)}><X className="h-6 w-6 dark:text-slate-400" /></button>
                </div>
                {/* Mobile Menu Content same as Desktop */}
                <SidebarContent role={role} userId={userId} menu={menu} active={active} setActive={(k) => { setActive(k); setSidebarOpen(false); }} onLogout={onLogout} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block col-span-3">
          <div className="glass-card p-5 sticky top-24">
            <SidebarContent role={role} userId={userId} menu={menu} active={active} setActive={setActive} onLogout={onLogout} />
          </div>
        </aside>

        <section className="col-span-12 md:col-span-9 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              {children(active)}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </Container>
  );
};

const SidebarContent = ({ role, userId, menu, active, setActive, onLogout }) => (
  <>
    <div className="flex items-center gap-3 pb-6 border-b border-dashed border-slate-200 dark:border-slate-700">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
        <User className="h-6 w-6" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Account</div>
        <div className="text-sm font-bold dark:text-slate-200">{role === ROLES.SUPER_ADMIN ? "Super Admin" : (role ? role.charAt(0).toUpperCase() + role.slice(1) : "Guest")}</div>
        <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 pt-0.5">{userId}</div>
      </div>
    </div>
    <ul className="mt-6 space-y-2">
      {menu.map((m) => (
        <li key={m.key}>
          <button onClick={() => setActive(m.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all group ${active === m.key ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "hover:bg-slate-50 text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/50"}`}>
            <span className={`transition-transform duration-300 ${active === m.key ? "scale-110" : "group-hover:scale-110"}`}>{m.icon}</span>
            <span className="font-medium">{m.label}</span>
          </button>
        </li>
      ))}
    </ul>
    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
      <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors dark:text-red-400 dark:hover:bg-red-900/10">
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    </div>
  </>
);


const Field = ({ label, value }) => (
  <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800 hover:border-indigo-100 transition-colors">
    <div className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-400 font-semibold mb-1">{label}</div>
    <div className="font-medium text-slate-800 dark:text-slate-200">{value}</div>
  </div>
);

const DataTable = ({ items, cols, empty, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    if (!search) return items;
    const lower = search.toLowerCase();
    return items.filter(it => cols.some(c => String(it[c] ?? "").toLowerCase().includes(lower)));
  }, [items, search, cols]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white/40 backdrop-blur-sm p-2 rounded-xl border border-white/40 dark:bg-slate-900/40 dark:border-slate-800">
        <div className="relative w-full max-w-xs">
          <input
            className="w-full bg-transparent text-sm pl-9 pr-4 py-2 focus:outline-none dark:text-slate-200 placeholder:text-slate-500"
            placeholder="Search records..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <div className="px-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Total: {filtered.length}</div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-indigo-50/50 dark:bg-slate-800/50 border-b border-indigo-100 dark:border-slate-700">
              <tr>
                {cols.map((c) => <th key={c} className="p-4 text-left font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider text-xs">{c.replace(/_/g, " ")}</th>)}
                {(onEdit || onDelete) && <th className="p-4 text-right font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider text-xs">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.length === 0 && (<tr><td className="p-8 text-center text-slate-500 dark:text-slate-400 italic" colSpan={cols.length + ((onEdit || onDelete) ? 1 : 0)}>{search ? "No matches found" : empty}</td></tr>)}
              {paginated.map((it, idx) => (
                <tr key={idx} className="hover:bg-indigo-50/40 transition-colors dark:hover:bg-slate-800/40 group">
                  {cols.map((c) => (<td key={c} className="p-4 text-slate-700 dark:text-slate-300 font-medium">{String(it[c] ?? "").toString()}</td>))}
                  {(onEdit || onDelete) && (
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 text-right">
                        {onEdit && <button onClick={() => onEdit(it)} className="p-2 text-indigo-600 hover:bg-white rounded-lg shadow-sm hover:shadow transition-all"><Edit className="h-4 w-4" /></button>}
                        {onDelete && <button onClick={() => onDelete(it)} className="p-2 text-red-600 hover:bg-white rounded-lg shadow-sm hover:shadow transition-all"><Trash2 className="h-4 w-4" /></button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 text-xs font-semibold rounded-lg border disabled:opacity-50 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition">Prev</button>
          <span className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 rounded-lg dark:bg-slate-800">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 text-xs font-semibold rounded-lg border disabled:opacity-50 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition">Next</button>
        </div>
      )}
    </div>


  );
};

function useBackend() {

  // Minimal client helpers to call backend
  const addFaculty = (p) => fetcher('/api/admin/faculty', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const listFaculty = () => fetcher('/api/admin/faculty');
  const updateFaculty = (id, p) => fetcher(`/api/admin/faculty/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const deleteFaculty = (id) => fetcher(`/api/admin/faculty/${id}`, { method: 'DELETE' });

  const addStudent = (p) => fetcher('/api/admin/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const listStudents = () => fetcher('/api/admin/students');
  const updateStudent = (id, p) => fetcher(`/api/admin/students/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const deleteStudent = (id) => fetcher(`/api/admin/students/${id}`, { method: 'DELETE' });

  const addAdmin = (p) => fetcher('/api/admin/admins', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const listAdmins = () => fetcher('/api/admin/admins');
  const updateAdmin = (id, p) => fetcher(`/api/admin/admins/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const deleteAdmin = (id) => fetcher(`/api/admin/admins/${id}`, { method: 'DELETE' });

  const markAttendance = (p) => fetcher('/api/faculty/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const getAttendance = (subId, date) => fetcher(`/api/faculty/attendance?subject_id=${subId}&date=${date}`);
  const saveResults = (p) => fetcher('/api/faculty/results', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const studentProfile = (sid) => fetcher(`/api/student/${sid}/profile`);
  const studentAttendance = (sid) => fetcher(`/api/student/${sid}/attendance`);
  const studentResults = (sid) => fetcher(`/api/student/${sid}/results`);

  // Refactored to use dedicated dashboard endpoints
  const getStats = async () => {
    // For admin, use the dedicated stats endpoint
    return fetcher('/api/dashboard/admin/stats');
  };
  const getStudentStats = (sid) => fetcher(`/api/dashboard/student/${sid}/stats`);
  const getTeacherStats = (fid) => fetcher(`/api/dashboard/faculty/${fid}/stats`); // Corrected URL
  const listSubjects = () => fetcher('/api/admin/subjects');

  const getAttendanceReport = () => fetcher('/api/admin/reports/attendance');
  const getPerformanceReport = () => fetcher('/api/admin/reports/performance');
  const getRegistrationsReport = (start, end) => fetcher(`/api/admin/reports/registrations?start_date=${start || ''}&end_date=${end || ''}`);
  const getCharts = () => fetcher('/api/admin/reports/charts');
  const getExportUrl = (type) => `/api/admin/reports/export/${type}`; // Helper to get direct link

  // User Management
  const getUsers = (role) => fetcher(`/api/admin/users/${role}`);
  const blockUser = (role, id, reason) => fetcher(`/api/admin/users/${role}/${id}/block`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) });
  const unblockUser = (role, id) => fetcher(`/api/admin/users/${role}/${id}/unblock`, { method: 'POST' });

  return {
    addFaculty, listFaculty, updateFaculty, deleteFaculty,
    addStudent, listStudents, updateStudent, deleteStudent,
    addAdmin, listAdmins, updateAdmin, deleteAdmin,
    listSubjects,
    markAttendance, getAttendance, saveResults, studentProfile, studentAttendance, studentResults, getStats, getStudentStats, getTeacherStats,
    getAttendanceReport, getPerformanceReport, getRegistrationsReport, getCharts, getExportUrl,
    getUsers, blockUser, unblockUser
  };
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Uncaught error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
          <h1 className="text-2xl font-bold mb-2">Something went wrong.</h1>
          <p className="text-red-500 mb-4 bg-red-100 p-2 rounded max-w-lg overflow-auto">
            {this.state.error && this.state.error.toString()}
          </p>
          <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

async function fetcher(url, options = {}) {
  try {
    // 1. First check if we have our own JWT session token
    let token = null;
    const savedSession = localStorage.getItem("session");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        token = session.token;
      } catch (e) { }
    }

    // 2. Fallback to Firebase token (less preferred now that backend uses JWT)
    if (!token) {
      const user = auth.currentUser;
      if (user) {
        token = await user.getIdToken();
      }
    }

    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }

    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");

    if (res.status === 401 || res.status === 403) {
      // Token expired or unauthorized
      // Ideally we should redirect to login or show a modal
      // For now, just throw error
      throw new Error("Unauthorized access. Please login again.");
    }

    if (!res.ok) {
      let errMsg = `Request failed: ${res.status}`;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const err = await res.json();
        errMsg = err.error || errMsg;
      }
      throw new Error(errMsg);
    }
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return res.json();
    }
    return {};
  } catch (error) {
    console.error("API Call Error:", error);
    return { error: error.message };
  }
}


export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}


function AppContent() {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem("session");
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  const [stage, setStage] = useState(session ? "dashboard" : "home");
  const api = useBackend();

  React.useEffect(() => {
    if (session) setStage("dashboard");
    else setStage("home");
  }, [session]);

  const handleLoginClick = () => setStage("auth");
  const handleLoggedIn = ({ role, id, email, token }) => {
    const newSession = { role, id, email, token };
    localStorage.setItem("session", JSON.stringify(newSession));
    setSession(newSession);
  };
  const logout = () => {
    localStorage.removeItem("session");
    setSession(null);
    setStage("home");
  };

  if (stage === "auth") return <AuthPanel onLoggedIn={handleLoggedIn} onHomeClick={() => setStage("home")} />;
  if (stage === "dashboard" && session) {
    const { role, id } = session;
    return (
      <DashboardLayout role={role} userId={id} onLogout={logout} onHomeClick={() => setStage("home")}>
        {(active) => {
          if (role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN) {
            if (active === "overview") {
              return (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <SectionCard title="Quick Actions" icon={<BarChart3 className="h-5 w-5" />}>Use the sidebar to manage faculty, students, and view system reports.</SectionCard>
                  </div>
                  <StatsLoader api={api} role={role} id={id} />
                </div>
              );
            }
            if (active === "admins" && role === ROLES.SUPER_ADMIN) {
              return <AdminManager api={api} />;
            }
            if (active === "faculty") {
              return <FacultyManager api={api} />;
            }
            if (active === "students") {
              return <StudentManager api={api} />;
            }
            if (active === "reports") {
              return <AdminReports api={api} />;
            }
            if (active === "settings") {
              return <UserManagement api={api} currentUserRole={role} />;
            }
          }
          if (role === ROLES.FACULTY) {
            if (active === "overview") {
              return <div className="space-y-6"><SectionCard title="Welcome Faculty" icon={<Users className="h-5 w-5" />}>Use Mark Attendance or Results.</SectionCard><StatsLoader api={api} role={role} id={id} /></div>;
            }
            if (active === "mark") {
              return <AttendanceForm onSubmit={async (payload) => {
                const r = await api.markAttendance({ ...payload, faculty_id: id });
                if (r.error) toast.error(r.error);
                else toast.success("Attendance marked!");
              }} listFn={api.listStudents} listSubjects={api.listSubjects} getAttendance={api.getAttendance} />;
            }
            if (active === "students") {
              return <SectionCard title="Student List" icon={<Users className="h-5 w-5" />}><Loader listFn={api.listStudents} cols={["u_id", "name", "email", "phone"]} empty="No students yet" /></SectionCard>;
            }
            if (active === "results") {
              return <ResultsForm onSubmit={async (payload) => {
                const r = await api.saveResults({ ...payload, faculty_id: id });
                if (r.error) toast.error(r.error);
                else toast.success("Results saved!");
              }} listFn={api.listStudents} listSubjects={api.listSubjects} />;
            }
          }

          if (role === ROLES.STUDENT) {
            if (active === "overview") {
              return <div className="space-y-6"><SectionCard title="Welcome" icon={<User className="h-5 w-5" />}>Use Profile / Attendance / Results</SectionCard><StatsLoader api={api} role={role} id={id} /></div>;
            }
            if (active === "profile") return <StudentProfile sid={id} fetcher={api.studentProfile} />;
            if (active === "attendance") return <StudentAttendance sid={id} fetcher={api.studentAttendance} />;
            if (active === "results") return <StudentResults sid={id} fetcher={api.studentResults} />;
          }
          return <div className="text-slate-600">Select a menu item.</div>;
        }}
      </DashboardLayout>
    );
  }
  return <Home onLogin={handleLoginClick} onHomeClick={() => setStage("home")} session={session} onLogout={logout} onDashboardClick={() => setStage("dashboard")} />;
}





const EditModal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="glass-card p-6 w-full max-w-lg pointer-events-auto bg-white dark:bg-slate-900 border dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl dark:text-white">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"><X className="h-5 w-5 text-slate-500" /></button>
              </div>
              {children}
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};


// Other complex components (Loader, StatsLoader, etc) to be wrapped or kept as is
// Since I'm rewriting the file, I must include them.
// I will keep them but style them up slightly.

const Skeleton = ({ className }) => <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`} />;

function Loader({ listFn, cols, empty, onEdit, onDelete }) {
  const [items, setItems] = useState(null);
  const [stamp, setStamp] = useState(0);

  const refresh = () => setStamp(s => s + 1);

  React.useEffect(() => {
    // Artificial delay to show skeleton
    const p = listFn().then(setItems).catch(() => setItems([]));
  }, [stamp, listFn]);

  const handleDelete = async (item) => {
    if (confirm("Are you sure?")) {
      await onDelete(item);
      refresh();
    }
  };

  const handleEdit = (item) => {
    onEdit(item, refresh);
  };

  if (!items) {
    return (
      <div className="rounded-xl border border-slate-200 overflow-hidden dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800"><tr>{cols.map(c => <th key={c} className="p-4"><Skeleton className="h-4 w-20" /></th>)}</tr></thead>
          <tbody>
            {[1, 2, 3].map(i => (
              <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                {cols.map(c => <td key={c} className="p-4"><Skeleton className="h-4 w-full" /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <DataTable items={items} cols={cols} empty={empty} onEdit={onEdit ? handleEdit : null} onDelete={onDelete ? handleDelete : null} />;
}

// Manager Components - Tabbed Views for Admin
const AdminManager = ({ api }) => {
  const [view, setView] = useState("faculty"); // faculty, students, admins
  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {["faculty", "students", "admins"].map(v => (
          <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize ${view === v ? "bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-400"}`}>{v}</button>
        ))}
      </div>
      {view === "faculty" && <FacultyManager api={api} />}
      {view === "students" && <StudentManager api={api} />}
      {view === "admins" && <AdminList api={api} />}
    </div>
  );
};

const AdminList = ({ api }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editing, setEditing] = useState(null);
  const refresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Register Admin" icon={<Shield className="h-5 w-5" />}>
        <AdminForm onSubmit={async (payload) => { const r = await api.addAdmin(payload); if (r.error) toast.error(r.error); else { toast.success("Added"); refresh(); } }} />
      </SectionCard>
      <SectionCard title="Admins" icon={<Shield className="h-5 w-5" />} className="h-full">
        <Loader key={refreshKey} listFn={api.listAdmins} cols={["u_id", "name", "type", "dob"]} empty="No admins" onDelete={async (it) => { await api.deleteAdmin(it.u_id); refresh(); }} onEdit={setEditing} />
        <EditModal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Admin">
          {editing && <AdminForm initialData={editing} onSubmit={async (p) => {
            const r = await api.updateAdmin(editing.u_id, p);
            if (r.error) toast.error(r.error); else { toast.success("Updated"); setEditing(null); refresh(); }
          }} />}
        </EditModal>
      </SectionCard>
    </div>
  );
};

const FacultyManager = ({ api }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editing, setEditing] = useState(null);
  const refresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Register Faculty" icon={<Users className="h-5 w-5" />}>
        <FacultyForm onSubmit={async (payload) => { const r = await api.addFaculty(payload); if (r.error) toast.error(r.error); else { toast.success("Added"); refresh(); } }} />
      </SectionCard>
      <SectionCard title="Faculty List" icon={<Users className="h-5 w-5" />} className="h-full">
        <Loader key={refreshKey} listFn={api.listFaculty} cols={["u_id", "name", "email", "phone", "dob"]} empty="No faculty" onDelete={async (it) => { await api.deleteFaculty(it.u_id); refresh(); }} onEdit={setEditing} />
        <EditModal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Faculty">
          {editing && <FacultyForm initialData={editing} onSubmit={async (p) => {
            const r = await api.updateFaculty(editing.u_id, p);
            if (r.error) toast.error(r.error); else { toast.success("Updated"); setEditing(null); refresh(); }
          }} />}
        </EditModal>
      </SectionCard>
    </div>
  );
};

const StudentManager = ({ api }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editing, setEditing] = useState(null);
  const refresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Register Student" icon={<GraduationCap className="h-5 w-5" />}>
        <StudentForm onSubmit={async (payload) => { const r = await api.addStudent(payload); if (r.error) toast.error(r.error); else { toast.success("Added"); refresh(); } }} />
      </SectionCard>
      <SectionCard title="Student List" icon={<GraduationCap className="h-5 w-5" />} className="h-full">
        <Loader key={refreshKey} listFn={api.listStudents} cols={["u_id", "name", "email", "phone", "dob"]} empty="No students" onDelete={async (it) => { await api.deleteStudent(it.u_id); refresh(); }} onEdit={setEditing} />
        <EditModal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Student">
          {editing && <StudentForm initialData={editing} onSubmit={async (p) => {
            const r = await api.updateStudent(editing.u_id, p);
            if (r.error) toast.error(r.error); else { toast.success("Updated"); setEditing(null); refresh(); }
          }} />}
        </EditModal>
      </SectionCard>
    </div>
  );
};

// --- Forms ---

function AdminForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    u_id: initialData.u_id || "",
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    dob: initialData.dob || "",
    type: initialData.type || "normal"
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (!formData.u_id || !formData.name || !formData.email || !formData.dob) {
        return toast.error("Please fill all sections");
      }
      onSubmit(formData);
    }} className="space-y-4">
      <Input label="Admin ID" value={formData.u_id} onChange={v => setFormData({ ...formData, u_id: v })} placeholder="e.g. A_002" required disabled={!!initialData.u_id} />
      <Input label="Name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} required />
      <Input label="Email" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} required />
      <Input label="Contact Number" type="tel" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} placeholder="10-digit number" />
      <Input label="Date of Birth" type="date" value={formData.dob} onChange={v => setFormData({ ...formData, dob: v })} required />
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <input type="radio" name="type" value="normal" checked={formData.type === "normal"} onChange={() => setFormData({ ...formData, type: "normal" })} /> Normal
        </label>
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <input type="radio" name="type" value="super" checked={formData.type === "super"} onChange={() => setFormData({ ...formData, type: "super" })} /> Super
        </label>
      </div>
      <PrimaryBtn type="submit">{initialData.u_id ? "Update" : "Add Admin"}</PrimaryBtn>
    </form>
  );
}

function FacultyForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    u_id: initialData.u_id || "",
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    dob: initialData.dob || ""
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (!formData.u_id || !formData.name || !formData.email || !formData.dob) {
        return toast.error("Please fill all sections");
      }
      onSubmit(formData);
    }} className="space-y-4">
      <Input label="Faculty ID" value={formData.u_id} onChange={v => setFormData({ ...formData, u_id: v })} placeholder="e.g. F_002" required disabled={!!initialData.u_id} />
      <Input label="Name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} required />
      <Input label="Email" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} required />
      <Input label="Contact Number" type="tel" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} placeholder="10-digit number" />
      <Input label="Date of Birth" type="date" value={formData.dob} onChange={v => setFormData({ ...formData, dob: v })} required />
      <PrimaryBtn type="submit">{initialData.u_id ? "Update" : "Add Faculty"}</PrimaryBtn>
    </form>
  );
}

function StudentForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    u_id: initialData.u_id || "",
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    dob: initialData.dob || ""
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (!formData.u_id || !formData.name || !formData.email || !formData.dob) {
        return toast.error("Please fill all sections");
      }
      onSubmit(formData);
    }} className="space-y-4">
      <Input label="Student ID" value={formData.u_id} onChange={v => setFormData({ ...formData, u_id: v })} placeholder="e.g. S_002" required disabled={!!initialData.u_id} />
      <Input label="Name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} required />
      <Input label="Email" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} required />
      <Input label="Contact Number" type="tel" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} placeholder="10-digit number" />
      <Input label="Date of Birth" type="date" value={formData.dob} onChange={v => setFormData({ ...formData, dob: v })} required />
      <PrimaryBtn type="submit">{initialData.u_id ? "Update" : "Add Student"}</PrimaryBtn>
    </form>
  );
}

function StatsLoader({ api, role, id }) {
  const [stats, setStats] = useState(null);

  React.useEffect(() => {
    let p;
    if (role === "admin" || role === "super_admin") p = api.getStats();
    else if (role === "faculty") p = api.getTeacherStats(id);
    else if (role === "student") p = api.getStudentStats(id);

    if (p) {
      p.then(s => setStats(s || {})).catch(() => setStats({}));
    }
  }, [api, role, id]);

  if (!stats) return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}</div>;

  // --- ADMIN VIEW ---
  if (role === "admin" || role === "super_admin") {
    const data = [
      { name: 'Faculty', count: stats.faculty || 0, fill: '#8884d8' },
      { name: 'Students', count: stats.students || 0, fill: '#82ca9d' },
      { name: 'Subjects', count: stats.subjects || 0, fill: '#ffc658' },
    ];
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Faculty" value={stats.faculty} icon={<Users className="w-6 h-6 text-indigo-100" />} color="bg-gradient-to-br from-indigo-500 to-indigo-600" />
          <StatCard title="Total Students" value={stats.students} icon={<GraduationCap className="w-6 h-6 text-emerald-100" />} color="bg-gradient-to-br from-emerald-500 to-emerald-600" />
          <StatCard title="Subjects" value={stats.subjects} icon={<BookOpen className="w-6 h-6 text-amber-100" />} color="bg-gradient-to-br from-amber-500 to-amber-600" />
        </div>
        <div className="glass-card p-6 h-80">
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">System Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // --- FACULTY VIEW ---
  if (role === "faculty") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="My Students" value={stats.students} icon={<Users className="w-6 h-6 text-blue-100" />} color="bg-gradient-to-br from-blue-500 to-cyan-500" />
          <StatCard title="Classes Taken" value={stats.classes_taken} icon={<ClipboardCheck className="w-6 h-6 text-violet-100" />} color="bg-gradient-to-br from-violet-500 to-purple-500" />
        </div>
        <div className="glass-card p-6 h-80">
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">Activity Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'My Students', count: stats.students || 0, fill: '#3b82f6' },
              { name: 'Classes Taken', count: stats.classes_taken || 0, fill: '#8b5cf6' }
            ]} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // --- STUDENT VIEW ---
  if (role === "student") {
    const attData = [
      { name: 'Present', value: stats.attendance || 0, fill: '#10b981' },
      { name: 'Absent', value: 100 - (stats.attendance || 0), fill: '#f43f5e' }
    ];
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Attendance" value={`${stats.attendance}%`} icon={<ClipboardCheck className="w-6 h-6 text-emerald-100" />} color="bg-gradient-to-br from-emerald-500 to-teal-500" />
          <StatCard title="Avg. Marks" value={stats.avg_marks} icon={<FileText className="w-6 h-6 text-pink-100" />} color="bg-gradient-to-br from-pink-500 to-rose-500" />
        </div>
        <div className="glass-card p-6 h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={attData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {attData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return null;
}

const StatCard = ({ title, value, icon, color }) => (
  <div className={`p-6 rounded-2xl shadow-lg shadow-indigo-500/10 text-white ${color} flex items-center justify-between`}>
    <div>
      <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold mt-1">{value || 0}</p>
    </div>
    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
      {icon}
    </div>
  </div>
);

function AttendanceForm({ onSubmit, listFn, listSubjects, getAttendance }) {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});

  const [selectedStudent, setSelectedStudent] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [status, setStatus] = useState("present");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  React.useEffect(() => {
    listFn().then(d => setStudents(d || [])).catch(() => setStudents([]));
    if (listSubjects) listSubjects().then(d => setSubjects(d || [])).catch(() => setSubjects([]));
  }, [listFn, listSubjects]);

  React.useEffect(() => {
    if (subjectId && date && getAttendance) {
      getAttendance(subjectId, date).then(data => {
        if (data && !data.error) setAttendanceMap(data);
        else setAttendanceMap({});
      });
    } else {
      setAttendanceMap({});
    }
  }, [subjectId, date, getAttendance]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent) return toast.error("Select student");
    if (!subjectId) return toast.error("Select subject");

    // Client-side check
    if (attendanceMap[selectedStudent]) {
      return toast.error(`Attendance already marked as ${attendanceMap[selectedStudent]}`);
    }

    onSubmit({
      faculty_id: "CURRENT_USER_ID_HANDLED_BY_WRAPPER",
      subject_id: subjectId,
      date,
      statusMap: { [selectedStudent]: status }
    }).then(() => {
      // Refresh local map after successful submit (optimistic or re-fetch)
      // Since onSubmit closes over the function in App, we might need a way to refresh.
      // For now, re-triggering the effect or manually updating state:
      setAttendanceMap(prev => ({ ...prev, [selectedStudent]: status }));
    });
  };

  const currentStatus = selectedStudent ? attendanceMap[selectedStudent] : null;

  return (
    <SectionCard title="Mark Attendance" icon={<ClipboardCheck className="h-5 w-5" />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Select Subject</label>
            <select className="w-full rounded-xl border px-3 py-2 glass-input dark:bg-slate-800 dark:border-slate-700" value={subjectId} onChange={e => setSubjectId(e.target.value)} required>
              <option value="">-- Choose Subject --</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <Input label="Date" type="date" value={date} onChange={setDate} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Select Student</label>
          <select className="w-full rounded-xl border px-3 py-2 glass-input dark:bg-slate-800 dark:border-slate-700" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required>
            <option value="">-- Choose Student --</option>
            {students.map(s => <option key={s.u_id} value={s.u_id}>
              {s.name} ({s.u_id}) {attendanceMap[s.u_id] ? `(${attendanceMap[s.u_id].toUpperCase()})` : ""}
            </option>)}
          </select>
        </div>

        {currentStatus ? (
          <div className={`p-4 rounded-xl border ${currentStatus === 'present' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'} flex items-center gap-2`}>
            {currentStatus === 'present' ? <ClipboardCheck className="h-5 w-5" /> : <X className="h-5 w-5" />}
            <span className="font-bold">Attendance for this student is already marked as {currentStatus.toUpperCase()}</span>
          </div>
        ) : (
          <div className="flex gap-4">
            <label className="flex items-center gap-2 dark:text-slate-300">
              <input type="radio" name="status" value="present" checked={status === "present"} onChange={() => setStatus("present")} /> Present
            </label>
            <label className="flex items-center gap-2 dark:text-slate-300">
              <input type="radio" name="status" value="absent" checked={status === "absent"} onChange={() => setStatus("absent")} /> Absent
            </label>
          </div>
        )}

        <PrimaryBtn type="submit" className="w-full" disabled={!!currentStatus}>
          {currentStatus ? "Already Marked" : "Mark"}
        </PrimaryBtn>
      </form>

      {/* Mini View of Marked Students */}
      {Object.keys(attendanceMap).length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-sm text-slate-500 mb-3 uppercase tracking-wider">Marked Students for {date}</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(attendanceMap).map(([sid, st]) => {
              const sName = students.find(s => s.u_id === sid)?.name || sid;
              return (
                <span key={sid} className={`px-2 py-1 rounded text-xs font-bold border ${st === 'present' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {sName}: {st.toUpperCase()}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </SectionCard>
  );
}

function ResultsForm({ onSubmit, listFn, listSubjects }) {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [marks, setMarks] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");

  React.useEffect(() => {
    listFn().then(d => setStudents(d || [])).catch(() => setStudents([]));
    if (listSubjects) listSubjects().then(d => setSubjects(d || [])).catch(() => setSubjects([]));
  }, [listFn, listSubjects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent) return toast.error("Select student");
    if (!subjectId) return toast.error("Select subject");

    const payload = {
      faculty_id: "CURRENT_USER_ID_HANDLED_BY_WRAPPER",
      subject_id: subjectId,
      marksMap: { [selectedStudent]: marks },
      max_marks: maxMarks
    };
    alert(`DEBUG: Sending Payload: ${JSON.stringify(payload)}`);
    onSubmit(payload);
  }

  return (
    <SectionCard title="Upload Marks" icon={<BookOpen className="h-5 w-5" />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Select Subject</label>
          <select className="w-full rounded-xl border px-3 py-2 glass-input dark:bg-slate-800 dark:border-slate-700" value={subjectId} onChange={e => setSubjectId(e.target.value)} required>
            <option value="">-- Choose Subject --</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Select Student</label>
          <select className="w-full rounded-xl border px-3 py-2 glass-input dark:bg-slate-800 dark:border-slate-700" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required>
            <option value="">-- Choose Student --</option>
            {students.map(s => <option key={s.u_id} value={s.u_id}>{s.name} ({s.u_id})</option>)}
          </select>
        </div>
        <Input label="Marks Obtained" type="number" value={marks} onChange={setMarks} />
        <Input label="Max Marks" type="number" value={maxMarks} onChange={setMaxMarks} />
        <PrimaryBtn type="submit" className="w-full">Save</PrimaryBtn>
      </form>
    </SectionCard>
  );
}

const StudentProfile = ({ sid, fetcher }) => {
  const [data, setData] = useState(null);
  React.useEffect(() => { fetcher(sid).then(setData).catch(() => setData({})); }, [sid, fetcher]);
  if (!data) return <Skeleton className="h-40" />;

  const profile = data.data || data;

  return (
    <SectionCard title="My Profile" icon={<User className="h-5 w-5" />}>
      <div className="space-y-2">
        {(!profile || Object.keys(profile).length === 0 || profile.error) ? <p className="text-slate-500">No profile data loaded.</p> :
          Object.entries(profile).map(([k, v]) => <Field key={k} label={k.replace(/_/g, ' ')} value={String(v)} />)}
      </div>
    </SectionCard>
  );
};

const StudentAttendance = ({ sid, fetcher }) => {
  const [data, setData] = useState([]);
  React.useEffect(() => { fetcher(sid).then(d => setData(Array.isArray(d) ? d : [])); }, [sid, fetcher]);

  return <SectionCard title="My Attendance" icon={<ClipboardCheck className="h-5 w-5" />}>
    <DataTable items={data} cols={["date", "subject", "status"]} empty="No attendance records" />
  </SectionCard>;
};

const StudentResults = ({ sid, fetcher }) => {
  const [data, setData] = useState([]);
  React.useEffect(() => { fetcher(sid).then(d => setData(Array.isArray(d) ? d : [])); }, [sid, fetcher]);

  return <SectionCard title="My Marks" icon={<BookOpen className="h-5 w-5" />}>
    <DataTable items={data} cols={["subject", "obtained", "max"]} empty="No marks found" />
  </SectionCard>;
};
