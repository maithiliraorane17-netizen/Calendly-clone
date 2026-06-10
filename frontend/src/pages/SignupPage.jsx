import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Calendar, ArrowRight, Zap, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const perks = [
  "Free forever, no credit card",
  "14-day Pro trial included",
  "Set up in under 2 minutes",
  "Connect all your calendars",
];

export default function SignupPage() {
  const [show, setShow]       = useState(false);
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [focused, setFocused] = useState(null);

  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name",     label: "Full Name", placeholder: "Maithili Thakur",   icon: User, type: "text" },
    { key: "email",    label: "Email",     placeholder: "you@example.com",    icon: Mail, type: "email" },
    { key: "password", label: "Password",  placeholder: "Min. 8 characters",  icon: Lock, type: show ? "text" : "password", toggle: true },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #06B6D4, transparent)", top: "10%", right: "5%" }} />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left perks */}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}>
              <Calendar size={20} className="text-white" />
            </div>
            <span className="font-bold text-2xl text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Schedu<span style={{ color: "#8B5CF6" }}>ly</span>
            </span>
          </Link>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Start scheduling<br />
            <span style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              smarter today
            </span>
          </h2>
          <p className="text-gray-400 mb-10">Join 10 million professionals who save time with Schedulely.</p>
          <ul className="space-y-4">
            {perks.map((perk, i) => (
              <motion.li key={perk} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(139,92,246,0.2)" }}>
                  <Check size={13} style={{ color: "#8B5CF6" }} />
                </div>
                <span className="text-gray-300 text-sm">{perk}</span>
              </motion.li>
            ))}
          </ul>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mt-12 glass-card p-4 rounded-2xl inline-block border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="glow-dot" />
              <span className="text-xs text-gray-400 font-medium">Your first meeting, booked!</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: "rgba(139,92,246,0.2)" }}>📅</div>
              <div>
                <p className="text-sm font-semibold text-white">Product Demo Call</p>
                <p className="text-xs text-gray-500">Today at 3:00 PM · 30 min</p>
              </div>
              <div className="ml-4 px-2.5 py-1 rounded-full text-xs font-medium text-green-400"
                style={{ background: "rgba(52,211,153,0.1)" }}>✓ Confirmed</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right form */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
          <div className="gradient-border p-8" style={{ boxShadow: "0 20px 60px rgba(139,92,246,0.15)" }}>
            <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Create your account
            </h1>
            <p className="text-gray-400 text-sm mb-6">Free forever. No credit card required.</p>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 text-sm"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5" }}>
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[{ label: "Google", emoji: "🔵" }, { label: "Microsoft", emoji: "🪟" }].map((s) => (
                <motion.button key={s.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                  <span>{s.emoji}</span> {s.label}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">or with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map(({ key, label, placeholder, icon: Icon, type, toggle }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{label}</label>
                  <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 ${focused === key ? "border-purple-500/60" : "border-white/10"}`}
                    style={{ background: "rgba(255,255,255,0.03)", boxShadow: focused === key ? "0 0 20px rgba(139,92,246,0.15)" : "none" }}>
                    <Icon size={16} className={focused === key ? "text-purple-400" : "text-gray-500"} />
                    <input type={type} placeholder={placeholder} value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      onFocus={() => setFocused(key)} onBlur={() => setFocused(null)}
                      className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm outline-none" required />
                    {toggle && (
                      <button type="button" onClick={() => setShow(!show)} className="text-gray-500 hover:text-gray-300 transition-colors">
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <motion.button type="submit" disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2.5 transition-all duration-300 mt-2"
                style={{ background: loading ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #8B5CF6, #06B6D4)", boxShadow: loading ? "none" : "0 0 25px rgba(139,92,246,0.4)" }}>
                {loading ? (
                  <>
                    <motion.div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                      animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                    Creating account...
                  </>
                ) : (
                  <><Zap size={16} className="text-yellow-300" /> Create Free Account <ArrowRight size={15} /></>
                )}
              </motion.button>

              <p className="text-center text-xs text-gray-600">
                By signing up you agree to our{" "}
                <Link to="#" className="text-purple-400 hover:text-purple-300">Terms</Link> and{" "}
                <Link to="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>
              </p>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
