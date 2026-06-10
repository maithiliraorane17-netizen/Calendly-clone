import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, Plus, Users, BarChart2, X, Check,
  Copy, Zap, ChevronRight, LogOut, AlertCircle, RefreshCw,
  ToggleLeft, ToggleRight, Trash2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { eventAPI, userAPI } from "../api/services";
import { useNavigate } from "react-router-dom";

// ─── Greeting helper 
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// ─── Toast notification 
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium"
      style={{
        background: type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
        border: `1px solid ${type === "success" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
        color: type === "success" ? "#6EE7B7" : "#FCA5A5",
        backdropFilter: "blur(12px)",
      }}
    >
      {type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
      {msg}
    </motion.div>
  );
}

// ─── Main Dashboard 
export default function DashboardPage() {
  const { user, logout }              = useAuth();
  const navigate                      = useNavigate();

  // Data state
  const [eventTypes, setEventTypes]   = useState([]);
  const [stats, setStats]             = useState(null);
  const [upcoming, setUpcoming]       = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing]   = useState(false);

  // UI state
  const [modal, setModal]             = useState(false);
  const [copied, setCopied]           = useState(null);
  const [deleting, setDeleting]       = useState(null);
  const [toggling, setToggling]       = useState(null);
  const [toast, setToast]             = useState(null);

  // Create form state
  const [newEvent, setNewEvent]       = useState({
    title: "", duration: 30, locationType: "google_meet", color: "#8B5CF6", description: ""
  });
  const [creating, setCreating]       = useState(false);
  const [createError, setCreateError] = useState("");

  // ─── Show toast helper ──────────────────────────────────────────────────────
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
  }, []);

  // ─── Fetch all dashboard data ───────────────────────────────────────────────
  const fetchDashboard = useCallback(async (isInitial = false) => {
    if (isInitial) setLoadingData(true);
    else setRefreshing(true);
    try {
      const [eventsRes, statsRes] = await Promise.all([
        eventAPI.getAll(),
        userAPI.getDashboardStats(),
      ]);
      setEventTypes(eventsRes.data.eventTypes || []);
      setStats(statsRes.data.stats || null);
      setUpcoming(statsRes.data.upcomingBookings || []);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load dashboard data", "error");
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  }, [showToast]);

  // Initial load
  useEffect(() => {
    fetchDashboard(true);
  }, [fetchDashboard]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleCopyLink = (slug, id) => {
    const link = `${window.location.origin}/book/${user?.username}/${slug}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(id);
      showToast("Booking link copied!");
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const res = await eventAPI.toggle(id);
      setEventTypes((prev) =>
        prev.map((et) =>
          et._id === id ? { ...et, isActive: res.data.isActive } : et
        )
      );
      showToast(res.data.isActive ? "Event type activated" : "Event type deactivated");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to toggle", "error");
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?\n\nAll future bookings will be cancelled.`)) return;
    setDeleting(id);
    try {
      await eventAPI.delete(id);
      setEventTypes((prev) => prev.filter((et) => et._id !== id));
      // Also refresh stats since event count changed
      const statsRes = await userAPI.getDashboardStats();
      setStats(statsRes.data.stats || null);
      showToast("Event type deleted");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) {
      setCreateError("Event name is required");
      return;
    }
    setCreateError("");
    setCreating(true);
    try {
      await eventAPI.create({
        title:        newEvent.title.trim(),
        duration:     newEvent.duration,
        locationType: newEvent.locationType,
        color:        newEvent.color,
        description:  newEvent.description.trim(),
      });
      setModal(false);
      setNewEvent({ title: "", duration: 30, locationType: "google_meet", color: "#8B5CF6", description: "" });
      showToast("Event type created!");
      // Full refetch so bookingsThisMonth + stats are fresh
      await fetchDashboard(false);
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create event type");
    } finally {
      setCreating(false);
    }
  };

  const resetModal = () => {
    setModal(false);
    setCreateError("");
    setNewEvent({ title: "", duration: 30, locationType: "google_meet", color: "#8B5CF6", description: "" });
  };

  // ─── Stat cards config ───────────────────────────────────────────────────────
  const statCards = [
    { label: "Meetings this month", value: stats?.monthBookings  ?? 0,               icon: Calendar,  color: "#8B5CF6" },
    { label: "Total bookings",      value: stats?.totalBookings  ?? 0,               icon: Users,     color: "#06B6D4" },
    { label: "Hours saved",         value: stats ? `${stats.hoursSaved}h` : "0h",    icon: Clock,     color: "#EC4899" },
    { label: "Completion rate",     value: stats ? `${stats.completionRate}%` : "0%",icon: BarChart2, color: "#F59E0B" },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-20 pb-16 relative">
      <div className="absolute inset-0 mesh-bg pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pt-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {getGreeting()}, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {upcoming.length > 0
                ? `You have ${upcoming.length} upcoming meeting${upcoming.length > 1 ? "s" : ""}`
                : "No upcoming meetings scheduled"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Refresh button */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => fetchDashboard(false)}
              disabled={refreshing}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all border border-white/10 hover:bg-white/5"
              title="Refresh data"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setModal(true)}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <Plus size={16} /> New Event Type
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 transition-all border border-white/10 hover:border-red-500/30 hover:bg-red-500/5"
            >
              <LogOut size={15} /> Logout
            </motion.button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5 hover:scale-[1.02] transition-transform duration-200"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `${stat.color}20` }}>
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
                <div className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {loadingData
                    ? <div className="h-7 w-14 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.07)" }} />
                    : stat.value}
                </div>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Event Types ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Event Types
              </h2>
              <span className="text-xs text-gray-500 px-2.5 py-1 rounded-full border border-white/10"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                {eventTypes.length} total
              </span>
            </div>

            {/* Loading skeleton */}
            {loadingData ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card p-5 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-40 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
                        <div className="h-3 w-24 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            /* Empty state */
            ) : eventTypes.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-white font-semibold mb-2">No event types yet</h3>
                <p className="text-gray-500 text-sm mb-6">Create your first booking link and start accepting meetings.</p>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setModal(true)}
                  className="btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2">
                  <Plus size={15} /> Create Event Type
                </motion.button>
              </motion.div>

            /* Event list */
            ) : (
              <div className="space-y-3">
                {eventTypes.map((event, i) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`glass-card p-5 group transition-all duration-200 ${
                      event.isActive ? "hover:scale-[1.01]" : "opacity-55"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: icon + info */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
                          style={{ background: `${event.color}22`, boxShadow: `0 0 18px ${event.color}25` }}>
                          <Clock size={19} style={{ color: event.color }} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-white text-sm truncate">{event.title}</h3>
                            {!event.isActive && (
                              <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{ background: "rgba(107,114,128,0.2)", color: "#9CA3AF" }}>
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-gray-500">{event.duration} min</span>
                            <span className="text-xs text-gray-700">·</span>
                            <span className="text-xs text-gray-500 capitalize">
                              {event.locationType?.replace("_", " ")}
                            </span>
                            <span className="text-xs text-gray-700">·</span>
                            <span className="text-xs font-medium" style={{ color: `${event.color}cc` }}>
                              {event.bookingsThisMonth || 0} bookings this month
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: action buttons — always visible on mobile, hover on desktop */}
                      <div className="flex items-center gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex-shrink-0">

                        {/* Toggle active/inactive */}
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggle(event._id)}
                          disabled={toggling === event._id}
                          title={event.isActive ? "Deactivate" : "Activate"}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          style={{ background: "rgba(255,255,255,0.06)" }}
                        >
                          {toggling === event._id ? (
                            <motion.div className="w-3.5 h-3.5 rounded-full border-2 border-gray-500 border-t-white"
                              animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                          ) : event.isActive ? (
                            <ToggleRight size={16} className="text-green-400" />
                          ) : (
                            <ToggleLeft size={16} className="text-gray-500" />
                          )}
                        </motion.button>

                        {/* Copy booking link */}
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleCopyLink(event.slug, event._id)}
                          title="Copy booking link"
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          style={{ background: "rgba(255,255,255,0.06)" }}
                        >
                          {copied === event._id
                            ? <Check size={14} className="text-green-400" />
                            : <Copy size={14} className="text-gray-400 hover:text-white" />}
                        </motion.button>

                        {/* Delete */}
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(event._id, event.title)}
                          disabled={deleting === event._id}
                          title="Delete event type"
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10"
                          style={{ background: "rgba(255,255,255,0.06)" }}
                        >
                          {deleting === event._id ? (
                            <motion.div className="w-3.5 h-3.5 rounded-full border-2 border-red-400/40 border-t-red-400"
                              animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                          ) : (
                            <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3.5 flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(((event.bookingsThisMonth || 0) / 20) * 100, 100)}%` }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${event.color}, ${event.color}80)` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 flex-shrink-0">
                        {event.bookingsThisMonth || 0} / 20
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* ── Upcoming Meetings ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Upcoming
              </h2>
              <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                View all <ChevronRight size={13} />
              </button>
            </div>

            {loadingData ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="glass-card p-4 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-28 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
                        <div className="h-3 w-20 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : upcoming.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <div className="text-3xl mb-3">🗓️</div>
                <p className="text-gray-500 text-sm">No upcoming meetings</p>
                <p className="text-gray-600 text-xs mt-1">Share your booking link to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((booking, i) => {
                  const color    = booking.eventType?.color || "#8B5CF6";
                  const initials = (booking.invitee?.name || "?")
                    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                  const date     = new Date(booking.scheduledAt);
                  const isToday  = date.toDateString() === new Date().toDateString();
                  return (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.07 }}
                      className="glass-card p-4 hover:scale-[1.02] transition-transform duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}>
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{booking.invitee?.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            <span className={isToday ? "text-purple-400 font-medium" : ""}>
                              {isToday ? "Today" : date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
                            </span>
                            {" · "}
                            {date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: `${color}20`, color }}>
                            {booking.duration}m
                          </span>
                          {isToday && (
                            <span className="text-xs text-green-400">Today</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Create Event Type Modal ── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
            style={{ background: "rgba(11,18,32,0.88)", backdropFilter: "blur(10px)" }}
            onClick={resetModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="gradient-border p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
              style={{ boxShadow: "0 30px 90px rgba(139,92,246,0.3)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={resetModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <X size={16} />
              </button>

              {/* Modal header */}
              <div className="text-center mb-7">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 220 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", boxShadow: "0 0 35px #8B5CF670" }}>
                  <Plus size={28} className="text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Create Event Type
                </h3>
                <p className="text-sm text-gray-500">Set up a new booking link in seconds</p>
              </div>

              {/* Create error */}
              <AnimatePresence>
                {createError && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4 text-xs overflow-hidden"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }}>
                    <AlertCircle size={13} className="flex-shrink-0" /> {createError}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleCreate} className="space-y-4">
                {/* Event name */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                    Event Name *
                  </label>
                  <input
                    placeholder="e.g. 30 Minute Meeting"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-purple-500/60 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                    Description <span className="text-gray-600 normal-case">(optional)</span>
                  </label>
                  <textarea
                    placeholder="What is this meeting about?"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-purple-500/60 transition-colors resize-none"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[15, 30, 45, 60, 90, 120].map((d) => (
                      <button key={d} type="button"
                        onClick={() => setNewEvent({ ...newEvent, duration: d })}
                        className="py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={newEvent.duration === d
                          ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", color: "#fff", boxShadow: "0 0 15px #8B5CF650" }
                          : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9CA3AF" }
                        }>
                        {d}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Location</label>
                  <select
                    value={newEvent.locationType}
                    onChange={(e) => setNewEvent({ ...newEvent, locationType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 text-white text-sm outline-none focus:border-purple-500/60 transition-colors"
                    style={{ background: "rgba(17,24,39,0.9)" }}
                  >
                    {[
                      { value: "google_meet", label: "🎥  Google Meet" },
                      { value: "zoom",        label: "💻  Zoom" },
                      { value: "teams",       label: "🪟  Microsoft Teams" },
                      { value: "phone",       label: "📞  Phone Call" },
                      { value: "in_person",   label: "🤝  In Person" },
                      { value: "custom",      label: "✏️  Custom" },
                    ].map((o) => (
                      <option key={o.value} value={o.value} style={{ background: "#111827" }}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Color</label>
                  <div className="flex gap-2.5 flex-wrap">
                    {["#8B5CF6", "#06B6D4", "#EC4899", "#F59E0B", "#10B981", "#EF4444", "#3B82F6", "#F97316"].map((c) => (
                      <motion.button key={c} type="button"
                        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                        onClick={() => setNewEvent({ ...newEvent, color: c })}
                        className="w-8 h-8 rounded-lg transition-all flex-shrink-0"
                        style={{
                          background: c,
                          outline: newEvent.color === c ? "2.5px solid #fff" : "none",
                          outlineOffset: "2px",
                          boxShadow: newEvent.color === c ? `0 0 12px ${c}80` : "none"
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={creating}
                  whileHover={!creating ? { scale: 1.02 } : {}}
                  whileTap={!creating ? { scale: 0.98 } : {}}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 mt-2 transition-all"
                  style={{
                    background: creating ? "rgba(139,92,246,0.45)" : "linear-gradient(135deg, #8B5CF6, #06B6D4)",
                    boxShadow: creating ? "none" : "0 0 28px rgba(139,92,246,0.45)"
                  }}
                >
                  {creating ? (
                    <>
                      <motion.div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                        animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                      Creating...
                    </>
                  ) : (
                    <><Zap size={15} className="text-yellow-300" /> Create Event Type</>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <Toast key={toast.msg} msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
