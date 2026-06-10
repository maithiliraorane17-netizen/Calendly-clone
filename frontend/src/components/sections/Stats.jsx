import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: "100K+", label: "Organizations use Schedulely", icon: "🏢" },
  { value: "10M+", label: "Active users worldwide", icon: "👥" },
  { value: "500M+", label: "Meetings scheduled", icon: "🗓️" },
  { value: "99.9%", label: "Uptime SLA guaranteed", icon: "⚡" },
];

const testimonials = [
  {
    quote: "Schedulely completely eliminated back-and-forth emails. Our sales team closes deals 3x faster now.",
    author: "Priya Sharma",
    role: "VP Sales, TechCorp",
    avatar: "PS",
    color: "#8B5CF6",
    stars: 5,
  },
  {
    quote: "We onboard 200+ clients per month. Without Schedulely, that would be impossible to manage.",
    author: "Alex Chen",
    role: "Head of Customer Success, ScaleAI",
    avatar: "AC",
    color: "#06B6D4",
    stars: 5,
  },
  {
    quote: "The integration with our CRM is seamless. Every booked meeting shows up in Salesforce automatically.",
    author: "Marcus Rivera",
    role: "Revenue Ops Manager, CloudBase",
    avatar: "MR",
    color: "#EC4899",
    stars: 5,
  },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 50%, #8B5CF608 0%, transparent 60%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="gradient-border p-6 text-center group hover:scale-[1.03] transition-transform duration-300"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl sm:text-4xl font-bold mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif", background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {stat.value}
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Loved by teams everywhere
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + idx * 0.12, duration: 0.6 }}
              className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300 group"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6 relative">
                <span className="text-4xl text-purple-500/30 font-serif absolute -top-2 -left-1">"</span>
                <span className="relative">{t.quote}</span>
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}80)` }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
