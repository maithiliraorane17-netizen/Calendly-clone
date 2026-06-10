import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Star, Zap, Users } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 mesh-bg" />
      
      {/* Orb blobs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)", top: "10%", left: "-10%" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)", bottom: "10%", right: "-5%" }}
        animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Badge */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 text-sm"
            style={{ background: "rgba(139,92,246,0.1)", backdropFilter: "blur(10px)" }}>
            <div className="glow-dot" />
            <span className="text-purple-300 font-medium">New: AI-powered scheduling is here</span>
            <ArrowRight size={14} className="text-purple-400" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="text-center mb-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="text-white">Scheduling that </span>
            <br />
            <span className="relative inline-block">
              <span className="relative z-10"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4, #8B5CF6)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                works like magic
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 rounded-full"
                style={{ background: "linear-gradient(90deg, #8B5CF6, #06B6D4)" }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              />
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="text-center text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop the back-and-forth emails. Share your calendar link, let people pick a time, and meetings happen — automatically.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link to="/signup"
            className="btn-primary flex items-center gap-2.5 px-8 py-4 text-base w-full sm:w-auto justify-center">
            <Zap size={18} className="text-yellow-300" />
            Get Started — It's Free
            <ArrowRight size={16} />
          </Link>
          <button className="btn-outline flex items-center gap-2.5 px-8 py-4 text-base w-full sm:w-auto justify-center">
            <Play size={16} fill="currentColor" className="text-purple-400" />
            Watch Demo
          </button>
        </motion.div>

        {/* Social proof bar */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["#8B5CF6", "#06B6D4", "#EC4899", "#F59E0B"].map((color, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-bg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: color, zIndex: 4 - i }}>
                  {["A","B","C","D"][i]}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-400">
              <strong className="text-white">10M+</strong> users worldwide
            </span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-white/20" />
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="#F59E0B" stroke="none" className="text-yellow-400" />
            ))}
            <span className="text-sm text-gray-400 ml-1"><strong className="text-white">4.9</strong>/5 from 2.4k reviews</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-white/20" />
          <div className="flex items-center gap-2">
            <Users size={15} className="text-cyan-400" />
            <span className="text-sm text-gray-400">Used by <strong className="text-white">86%</strong> of Fortune 500</span>
          </div>
        </motion.div>

        {/* Hero Visual - Calendar Demo */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="relative max-w-4xl mx-auto">
          <div className="gradient-border p-1 rounded-2xl shadow-2xl"
            style={{ boxShadow: "0 30px 80px rgba(139,92,246,0.2), 0 0 0 1px rgba(139,92,246,0.1)" }}>
            <div className="glass-card rounded-2xl p-6 overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 mx-4 h-7 rounded-lg flex items-center px-3 text-xs text-gray-500"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  schedulely.com/maithili/30min
                </div>
              </div>

              {/* Calendar UI */}
              <HeroDemoCalendar />
            </div>
          </div>

          {/* Floating badge */}
          <motion.div
            className="absolute -top-4 -right-4 glass-card px-4 py-3 rounded-xl shadow-xl border border-green-500/30 hidden sm:block"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-white">Meeting Confirmed!</span>
              <span className="text-lg">🎉</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Today at 3:00 PM • 30 min</p>
          </motion.div>

          <motion.div
            className="absolute -bottom-4 -left-4 glass-card px-4 py-3 rounded-xl shadow-xl border border-purple-500/30 hidden sm:block"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <div>
                <p className="text-xs font-semibold text-white">Zero back-and-forth</p>
                <p className="text-xs text-gray-400">Saved 2.4 hrs this week</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroDemoCalendar() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
  const available = [3,5,6,10,11,12,17,18,19];
  const selected = 11;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Calendar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            June 2025
          </h3>
          <div className="flex gap-1">
            {["←","→"].map((a, i) => (
              <button key={i} className="w-7 h-7 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm flex items-center justify-center">
                {a}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map((d) => (
            <div key={d} className="text-center text-xs text-gray-500 py-1 font-medium">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {dates.map((d) => {
            const isAvail = available.includes(d);
            const isSel = d === selected;
            return (
              <motion.button
                key={d}
                whileHover={isAvail ? { scale: 1.15 } : {}}
                whileTap={isAvail ? { scale: 0.95 } : {}}
                className={`aspect-square rounded-lg text-xs flex items-center justify-center font-medium transition-all duration-200 ${
                  isSel
                    ? "text-white shadow-lg"
                    : isAvail
                    ? "text-purple-300 hover:text-white cursor-pointer"
                    : "text-gray-700 cursor-default"
                }`}
                style={
                  isSel
                    ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", boxShadow: "0 0 15px #8B5CF680" }
                    : isAvail
                    ? { background: "rgba(139,92,246,0.15)" }
                    : {}
                }
              >
                {d}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div>
        <h3 className="font-semibold text-white mb-4 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Wed, Jun 11 — Available times
        </h3>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
          {["9:00 AM", "9:30 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "3:30 PM", "4:00 PM"].map((time, i) => (
            <motion.button
              key={time}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.06 }}
              whileHover={{ x: 4 }}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium text-left transition-all duration-200 border flex items-center justify-between group ${
                i === 4
                  ? "border-transparent text-white"
                  : "border-white/10 text-gray-300 hover:border-purple-500/50 hover:text-white hover:bg-white/5"
              }`}
              style={
                i === 4
                  ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", boxShadow: "0 0 15px #8B5CF660" }
                  : {}
              }
            >
              <span>{time}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                i === 4
                  ? "bg-white/20 text-white"
                  : "text-gray-500 group-hover:text-purple-400 group-hover:bg-purple-500/10"
              }`}>
                {i === 4 ? "Selected ✓" : "30 min"}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
