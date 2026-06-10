import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const integrations = [
  { name: "Google Calendar", emoji: "📅", color: "#4285F4" },
  { name: "Zoom", emoji: "💻", color: "#2D8CFF" },
  { name: "Slack", emoji: "💬", color: "#4A154B" },
  { name: "Salesforce", emoji: "☁️", color: "#00A1E0" },
  { name: "HubSpot", emoji: "🔶", color: "#FF7A59" },
  { name: "Stripe", emoji: "💳", color: "#6772E5" },
  { name: "Microsoft Teams", emoji: "🪟", color: "#6264A7" },
  { name: "Gmail", emoji: "📧", color: "#EA4335" },
  { name: "Outlook", emoji: "📮", color: "#0078D4" },
  { name: "Zapier", emoji: "⚡", color: "#FF4A00" },
  { name: "Typeform", emoji: "📝", color: "#262627" },
  { name: "LinkedIn", emoji: "🔗", color: "#0A66C2" },
];

export default function Integrations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Split into 2 rows
  const row1 = integrations.slice(0, 6);
  const row2 = integrations.slice(6, 12);

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 border border-purple-500/30"
            style={{ color: "#8B5CF6", background: "rgba(139,92,246,0.1)" }}>
            ✦ Integrations
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Connect the tools you{" "}
            <span style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              already love
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            100+ integrations to supercharge your workflow. From CRMs to video conferencing.
          </p>
        </motion.div>

        {/* Scrolling integration rows */}
        <div className="space-y-4 overflow-hidden">
          {/* Row 1 - scroll left */}
          <div className="relative">
            <div className="flex gap-4 animate-[scrollLeft_25s_linear_infinite]" style={{ width: "max-content" }}>
              {[...row1, ...row1, ...row1].map((int, i) => (
                <IntegrationCard key={i} {...int} delay={i * 0.05} inView={isInView} />
              ))}
            </div>
          </div>

          {/* Row 2 - scroll right */}
          <div className="relative">
            <div className="flex gap-4 animate-[scrollRight_30s_linear_infinite]" style={{ width: "max-content" }}>
              {[...row2, ...row2, ...row2].map((int, i) => (
                <IntegrationCard key={i} {...int} delay={i * 0.05} inView={isInView} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-10"
        >
          <a href="#"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors group">
            View all 100+ integrations
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </motion.div>
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, #0B1220, transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-20 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, #0B1220, transparent)" }} />

      <style>{`
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes scrollRight {
          from { transform: translateX(-33.333%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

function IntegrationCard({ name, emoji, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-white/10 cursor-pointer flex-shrink-0 group transition-all duration-200"
      style={{
        background: "rgba(17,24,39,0.8)",
        backdropFilter: "blur(10px)",
        minWidth: "160px",
      }}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform"
        style={{ background: `${color}20` }}>
        {emoji}
      </div>
      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors whitespace-nowrap">
        {name}
      </span>
    </motion.div>
  );
}
