import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, Menu, X, Zap, LayoutDashboard, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const productLinks = [
  { label: "Scheduling",  desc: "Simplified booking experience", icon: "🗓️" },
  { label: "Payments",    desc: "Flexible ways to get paid",     icon: "💳" },
  { label: "Contacts",    desc: "Relationship management",       icon: "👥" },
  { label: "Analytics",   desc: "Meeting insights & reports",    icon: "📊" },
];
const solutionLinks = [
  { label: "For Individuals", desc: "For solopreneurs",     icon: "🙋" },
  { label: "Small Business",  desc: "For growing teams",    icon: "🏢" },
  { label: "Enterprise",      desc: "For large companies",  icon: "🏗️" },
  { label: "Recruiting",      desc: "Hire faster",          icon: "🎯" },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [userMenu, setUserMenu]     = useState(false);

  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
    setUserMenu(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const menuItems = [
    { label: "Product",   key: "product",   links: productLinks },
    { label: "Solutions", key: "solutions", links: solutionLinks },
    { label: "Pricing",   path: "/pricing" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3 backdrop-blur-xl border-b border-white/10" : "py-5"}`}
      style={{ background: scrolled ? "rgba(11,18,32,0.92)" : "transparent" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}>
              <Calendar size={18} className="text-white relative z-10" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
              Schedu<span className="neon-text" style={{ color: "#8B5CF6" }}>ly</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) =>
              item.path ? (
                <Link key={item.label} to={item.path}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200">
                  {item.label}
                </Link>
              ) : (
                <div key={item.label} className="relative"
                  onMouseEnter={() => setActiveMenu(item.key)}
                  onMouseLeave={() => setActiveMenu(null)}>
                  <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200">
                    {item.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === item.key ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {activeMenu === item.key && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }} className="absolute top-full left-0 mt-2 w-72 glass-card p-3 shadow-2xl">
                        {item.links.map((link) => (
                          <Link key={link.label} to="#" className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                            <span className="text-xl mt-0.5">{link.icon}</span>
                            <div>
                              <div className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">{link.label}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{link.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            )}
          </div>

          {/* Desktop CTA — show different if logged in */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative" onMouseEnter={() => setUserMenu(true)} onMouseLeave={() => setUserMenu(false)}>
                <button className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300 font-medium">{user.name?.split(" ")[0]}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenu ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full right-0 mt-2 w-48 glass-card p-2 shadow-2xl">
                      <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                        <User size={15} /> Profile
                      </Link>
                      <div className="my-1 border-t border-white/10" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                        <LogOut size={15} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm py-2 px-5">Log In</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
                  <Zap size={15} className="text-yellow-300" /> Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 overflow-hidden"
            style={{ background: "rgba(11,18,32,0.98)", backdropFilter: "blur(20px)" }}>
            <div className="px-4 py-6 space-y-4">
              {menuItems.map((item) => (
                <div key={item.label}>
                  <Link to={item.path || "#"} className="block py-2 text-base font-medium text-gray-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </div>
              ))}
              <div className="pt-4 flex flex-col gap-3 border-t border-white/10">
                {user ? (
                  <>
                    <Link to="/dashboard" className="btn-outline text-sm text-center py-3 flex items-center justify-center gap-2">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="py-3 rounded-xl text-sm font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login"  className="btn-outline text-sm text-center py-3">Log In</Link>
                    <Link to="/signup" className="btn-primary text-sm text-center py-3">Get Started Free</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
