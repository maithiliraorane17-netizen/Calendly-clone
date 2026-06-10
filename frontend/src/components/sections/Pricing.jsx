import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Zap, Building2, User, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    desc: "Perfect for individuals",
    icon: User,
    price: { monthly: 0, yearly: 0 },
    color: "#6B7280",
    cta: "Get Started Free",
    ctaStyle: "outline",
    features: [
      "1 event type",
      "Unlimited meetings",
      "Google, Outlook, iCloud sync",
      "Schedulely branded page",
      "Email notifications",
      "Mobile app access",
    ],
  },
  {
    name: "Standard",
    desc: "For professionals",
    icon: Zap,
    price: { monthly: 12, yearly: 10 },
    color: "#8B5CF6",
    cta: "Start Free Trial",
    ctaStyle: "primary",
    popular: false,
    features: [
      "Unlimited event types",
      "Custom branding & colors",
      "Payment collection",
      "SMS notifications",
      "Integrations (Zoom, Meet, Teams)",
      "Analytics dashboard",
    ],
  },
  {
    name: "Teams",
    desc: "For growing businesses",
    icon: Sparkles,
    price: { monthly: 20, yearly: 16 },
    color: "#06B6D4",
    cta: "Try for Free",
    ctaStyle: "gradient",
    popular: true,
    features: [
      "Everything in Standard",
      "Round-robin scheduling",
      "Collective events",
      "Team reporting",
      "Salesforce & HubSpot CRM",
      "Admin controls & SSO",
    ],
  },
  {
    name: "Enterprise",
    desc: "For large organizations",
    icon: Building2,
    price: { custom: true },
    color: "#F59E0B",
    cta: "Talk to Sales",
    ctaStyle: "outline",
    features: [
      "Everything in Teams",
      "Custom SLA & security",
      "HIPAA compliance",
      "Data residency options",
      "Dedicated CSM",
      "Custom integrations & API",
    ],
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="pricing" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, #06B6D408 0%, transparent 60%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 border border-cyan-500/30"
            style={{ color: "#06B6D4", background: "rgba(6,182,212,0.1)" }}>
            ✦ Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Simple, transparent pricing
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Start free, upgrade when you're ready. No hidden fees, no surprises.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-xl border border-white/10"
            style={{ background: "rgba(17,24,39,0.8)" }}>
            <button onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !yearly ? "text-white shadow-lg" : "text-gray-400 hover:text-white"
              }`}
              style={!yearly ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" } : {}}>
              Monthly
            </button>
            <button onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                yearly ? "text-white shadow-lg" : "text-gray-400 hover:text-white"
              }`}
              style={yearly ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" } : {}}>
              Yearly
              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: "#8B5CF620", color: "#A78BFA" }}>
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`relative gradient-border p-6 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
                  plan.popular ? "ring-1 ring-cyan-500/50" : ""
                }`}
                style={plan.popular ? { boxShadow: "0 0 40px rgba(6,182,212,0.15)" } : {}}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}>
                    ✦ Most Popular
                  </div>
                )}

                {/* Icon & Name */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${plan.color}20` }}>
                      <Icon size={22} style={{ color: plan.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {plan.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{plan.desc}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {plan.price.custom ? (
                    <div>
                      <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Custom
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Starts at $15k/yr</p>
                    </div>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        ${yearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      {(plan.price.monthly > 0 || plan.price.yearly > 0) && (
                        <span className="text-gray-500 text-sm mb-1">/seat/mo</span>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  className={`w-full py-3 rounded-xl text-sm font-semibold mb-6 transition-all duration-300 ${
                    plan.ctaStyle === "gradient"
                      ? "text-white hover:shadow-lg hover:-translate-y-0.5"
                      : plan.ctaStyle === "primary"
                      ? "border text-white hover:bg-white/5"
                      : "border text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                  style={
                    plan.ctaStyle === "gradient"
                      ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", boxShadow: "0 0 20px #8B5CF640" }
                      : plan.ctaStyle === "primary"
                      ? { borderColor: `${plan.color}60` }
                      : { borderColor: "rgba(255,255,255,0.15)" }
                  }
                >
                  {plan.cta}
                </button>

                {/* Features */}
                <ul className="space-y-2.5 mt-auto">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-gray-400">
                      <Check size={15} style={{ color: plan.color, flexShrink: 0, marginTop: "2px" }} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500 mt-10"
        >
          All plans include a 14-day free trial. No credit card required.{" "}
          <a href="#" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
            Compare all features →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
