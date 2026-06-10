import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

export default function CTASection() {
    const ref = useRef(null);
    const isInView = useInView(ref, {once: true, margin: "-100px"});

    return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(6,182,212,0.1) 100%)",
            border: "1px solid rgba(139,92,246,0.3)",
            boxShadow: "0 0 80px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Background orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: "radial-gradient(circle, #8B5CF6, transparent)" }} />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #06B6D4, transparent)" }} />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-purple-500/40"
              style={{ color: "#A78BFA", background: "rgba(139,92,246,0.15)" }}
            >
              <Zap size={12} fill="currentColor" />
              Start scheduling today
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Power up your{" "}
              <span style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                scheduling
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-lg max-w-xl mx-auto mb-10"
            >
              Get started in seconds — for free. No credit card required. Cancel anytime.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/signup"
                className="btn-primary flex items-center gap-2.5 px-8 py-4 text-base w-full sm:w-auto justify-center"
              >
                <Zap size={18} className="text-yellow-300" />
                Start for Free
                <ArrowRight size={16} />
              </Link>
              <Link to="/contact"
                className="btn-outline flex items-center gap-2.5 px-8 py-4 text-base w-full sm:w-auto justify-center"
              >
                Get a Demo
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="text-xs text-gray-600 mt-6"
            >
              ✓ Free forever plan &nbsp;·&nbsp; ✓ 14-day Pro trial &nbsp;·&nbsp; ✓ No credit card needed
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

