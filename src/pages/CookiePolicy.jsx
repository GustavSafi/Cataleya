import React from "react";
import { motion } from "framer-motion";
import { Cookie } from "lucide-react";

const Section = ({ title, children }) => (
  <section className="mb-10" aria-labelledby={`cookie-${title.replace(/\s+/g, "-").toLowerCase()}`}>
    <h2 id={`cookie-${title.replace(/\s+/g, "-").toLowerCase()}`} className="text-base font-bold text-foreground mb-3 font-display">{title}</h2>
    <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
  </section>
);

const TABLE_ROWS = [
  { name: "session_id", type: "Essential", purpose: "Maintains your session state", duration: "Session" },
  { name: "cart_token",  type: "Essential", purpose: "Preserves shopping cart contents", duration: "30 days" },
  { name: "_ga",         type: "Analytics", purpose: "Google Analytics — distinguishes users", duration: "2 years" },
  { name: "_gid",        type: "Analytics", purpose: "Google Analytics — distinguishes users", duration: "24 hours" },
  { name: "consent",     type: "Preference", purpose: "Stores your cookie consent choice", duration: "1 year" },
];

export default function CookiePolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
        <div className="flex items-center gap-3 mb-3">
          <Cookie className="w-5 h-5 text-primary" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Legal</span>
        </div>
        <h1 className="font-display text-3xl lg:text-4xl font-light mb-2">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Effective Date: January 1, 2024 · Last Updated: June 1, 2024</p>

        <Section title="1. What Are Cookies">
          <p>Cookies are small text files stored on your device by your browser. We use cookies to enable site functionality, analyze usage, and improve your experience. Some cookies are essential; others require your consent.</p>
        </Section>

        <Section title="2. Types of Cookies We Use">
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-xs border-collapse" aria-label="Cookie types and details">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="text-left py-2 pr-4 font-bold uppercase tracking-wider text-foreground">Cookie</th>
                  <th scope="col" className="text-left py-2 pr-4 font-bold uppercase tracking-wider text-foreground">Type</th>
                  <th scope="col" className="text-left py-2 pr-4 font-bold uppercase tracking-wider text-foreground">Purpose</th>
                  <th scope="col" className="text-left py-2 font-bold uppercase tracking-wider text-foreground">Duration</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row) => (
                  <tr key={row.name} className="border-b border-border/40">
                    <td className="py-2 pr-4 font-mono text-foreground">{row.name}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        row.type === "Essential" ? "bg-green-100 text-green-800"
                        : row.type === "Analytics" ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">{row.purpose}</td>
                    <td className="py-2 text-muted-foreground">{row.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="3. Managing Cookies">
          <p>You can manage or disable non-essential cookies at any time:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Via the Cookie Settings button in our site footer</li>
            <li>Through your browser settings (disabling cookies may affect functionality)</li>
            <li>Via Google Analytics opt-out: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-Out</a></li>
          </ul>
        </Section>

        <Section title="4. Third-Party Cookies">
          <p>We use Google Analytics for anonymous usage analytics. Their privacy policy is available at <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">policies.google.com/privacy</a>.</p>
        </Section>

        <Section title="5. Contact">
          <p>For cookie-related questions: <a href="mailto:privacy@cattleyalabs.com" className="text-primary hover:underline">privacy@cattleyalabs.com</a></p>
        </Section>
      </motion.div>
    </div>
  );
}