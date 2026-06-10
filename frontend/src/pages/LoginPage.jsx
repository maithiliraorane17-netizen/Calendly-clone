import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Calendar, ArrowRight, Zap, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [show, setShow]       = useState(false);
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [focused, setFocused] = useState(null);

  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const redirectTo   = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8B5CF6, transparent)", top: "20%", left: "10%" }} />
      <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #06B6D4, transparent)", bottom: "20%", right: "10%" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}>
              <Calendar size={20} className="text-white" />
            </div>
            <span className="font-bold text-2xl text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Schedu<span style={{ color: "#8B5CF6" }}>ly</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Welcome back
          </h1>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        <div className="gradient-border p-8" style={{ boxShadow: "0 20px 60px rgba(139,92,246,0.15)" }}>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 text-sm"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5" }}
            >
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[{ label: "Google", emoji: "🔵" }, { label: "Microsoft", emoji: "🪟" }].map((s) => (
              <motion.button key={s.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-white/10 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                <span>{s.emoji}</span> {s.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Email</label>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 ${focused === "email" ? "border-purple-500/60" : "border-white/10"}`}
                style={{ background: "rgba(255,255,255,0.03)", boxShadow: focused === "email" ? "0 0 20px rgba(139,92,246,0.15)" : "none" }}>
                <Mail size={16} className={focused === "email" ? "text-purple-400" : "text-gray-500"} />
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm outline-none" required />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 ${focused === "pass" ? "border-purple-500/60" : "border-white/10"}`}
                style={{ background: "rgba(255,255,255,0.03)", boxShadow: focused === "pass" ? "0 0 20px rgba(139,92,246,0.15)" : "none" }}>
                <Lock size={16} className={focused === "pass" ? "text-purple-400" : "text-gray-500"} />
                <input type={show ? "text" : "password"} placeholder="••••••••••" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused("pass")} onBlur={() => setFocused(null)}
                  className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm outline-none" required />
                <button type="button" onClick={() => setShow(!show)} className="text-gray-500 hover:text-gray-300 transition-colors">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2.5 transition-all duration-300 mt-2"
              style={{ background: loading ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #8B5CF6, #06B6D4)", boxShadow: loading ? "none" : "0 0 25px rgba(139,92,246,0.4)" }}>
              {loading ? (
                <>
                  <motion.div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                    animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                  Signing in...
                </>
              ) : (
                <><Zap size={16} className="text-yellow-300" /> Sign In <ArrowRight size={15} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign up free →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
