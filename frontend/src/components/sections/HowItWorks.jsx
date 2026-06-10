import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link2, CalendarCheck, Share2, CheckCircle2 } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Link2,
    title: "Connect your calendars",
    desc: "Link up to 6 calendars — Google, Outlook, iCloud. Schedulely checks real-time availability and prevents double bookings automatically.",
    color: "#8B5CF6",
    features: ["Google Calendar", "Outlook / Microsoft 365", "iCloud Calendar", "Exchange"],
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Set your availability",
    desc: "Define your working hours, add buffer time between meetings, and create custom rules for different types of events.",
    color: "#06B6D4",
    features: ["Custom working hours", "Buffer time between meetings", "Minimum scheduling notice", "Date override rules"],
  },
  {
    step: "03",
    icon: Share2,
    title: "Share your link",
    desc: "Send your personal booking link via email, embed it on your website, or add it to your email signature. Let anyone book a time effortlessly.",
    color: "#EC4899",
    features: ["Personal booking page", "Embed on any website", "Email signature ready", "QR code sharing"],
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      {/* BG decoration */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, #8B5CF608 0%, transparent 60%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 border border-purple-500/30"
            style={{ color: "#8B5CF6", background: "rgba(139,92,246,0.1)" }}>
            ✦ How it works
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Up and running in{" "}
            <span style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              3 easy steps
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            No complex setup, no learning curve. Connect, customize, and start getting booked in minutes.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8 relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-16 bottom-16 w-px hidden lg:block"
            style={{ background: "linear-gradient(to bottom, #8B5CF640, #06B6D440, transparent)" }} />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: idx * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="gradient-border p-6 sm:p-8 group hover:scale-[1.01] transition-transform duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Step number + icon */}
                  <div className="lg:col-span-1 flex lg:flex-col items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{ background: `${step.color}20`, boxShadow: `0 0 20px ${step.color}30` }}>
                      <Icon size={28} style={{ color: step.color }} />
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: step.color }}>
                        {idx + 1}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-7">
                    <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: step.color }}>
                      Step {step.step}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Features */}
                  <div className="lg:col-span-4">
                    <ul className="space-y-2.5">
                      {step.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2.5 text-sm text-gray-300">
                          <CheckCircle2 size={16} style={{ color: step.color, flexShrink: 0 }} />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
