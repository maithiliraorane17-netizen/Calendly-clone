import { Link } from "react-router-dom";
import { Calendar, Globe, Rss, Play, GitBranch } from "lucide-react";

const footerLinks = {
  Product: ["Scheduling", "Payments", "Contacts", "Analytics", "Mobile App", "Browser Extension"],
  Solutions: ["For Individuals", "Small Business", "Enterprise", "Sales", "Recruiting"],
  Resources: ["Help Center", "Blog", "Community", "API Docs", "Release Notes"],
  Company: ["About Us", "Careers", "Newsroom", "Security", "Privacy Policy"],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(at 50% 100%, #8B5CF608 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}>
                <Calendar size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Schedu<span style={{ color: "#8B5CF6" }}>ly</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              The modern scheduling platform that makes "finding time" effortless for everyone.
            </p>
            <div className="flex items-center gap-3">
              {[Globe, Rss, Play, GitBranch].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-all duration-200 hover:bg-white/10 border border-white/10 hover:border-purple-500/50">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link to="#"
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © 2025 Schedulely, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
              <Link key={item} to="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
