import { useState, useEffect } from "react";

// ─── HERO VARIANTS (swappable via ?v=1, ?v=2, ?v=3) ────────────────────────
const VARIANTS = {
  1: {
    headline: "Look like you live in the gym.",
    headlineMuted: "Train like you don't.",
    sub: "Intelligent programming. A coach's voice after every session. 45 minutes and done.",
  },
  2: {
    headline: "Your body is a résumé.",
    headlineMuted: "Get hired.",
    sub: "Structured training that fits your schedule. Personalized at every step.",
  },
  3: {
    headline: "Pecs for less than a salad.",
    headlineMuted: "Way less.",
    sub: "A real training system — not a workout generator. Intentional programming. Always-on coaching.",
  },
};

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const FORMSPREE_URL = "https://formspree.io/f/mojkajpg";

const IMAGES = {
  hero: "/hero-cover.jpg",
  proof: "/Matthew_Carmona_020524_0285.jpg",
};

// ─── UTM HELPER ────────────────────────────────────────────────────────────
function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "organic",
    utm_medium: params.get("utm_medium") || "none",
    utm_campaign: params.get("utm_campaign") || "none",
  };
}

// ─── EMAIL FORM ─────────────────────────────────────────────────────────────
function EmailCapture({ variant = "hero" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    try {
      const utm = getUtmParams();
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          email,
          variant,
          source: utm.utm_source,
          medium: utm.utm_medium,
          campaign: utm.utm_campaign,
        }),
      });
      const data = await res.json();
      const success = res.ok && data.ok;
      if (success) {
        setEmail("");
        // Fire Meta Pixel Lead event only after confirmed submission
        if (typeof window.fbq !== "undefined") {
          window.fbq("track", "Lead", {
            content_name: "waitlist_signup",
            content_category: variant,
          });
        }
      }
      setStatus(success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 py-3">
        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span style={{ fontFamily: "var(--f-body)", fontSize: "14px", color: "#4ade80" }}>You're on the list. We'll be in touch.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-1 focus:ring-white/20"
        style={{
          fontFamily: "var(--f-body)",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#e5e5e5",
          fontSize: "14px",
        }}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
        style={{
          fontFamily: "var(--f-body)",
          background: "#F5F0E8",
          color: "#0A0A0A",
          opacity: status === "sending" ? 0.6 : 1,
        }}
      >
        {status === "sending" ? "..." : "Join Waitlist"}
      </button>
    </form>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function CarmonaOS() {
  const [v, setV] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const variant = parseInt(params.get("v"));
    if (variant && VARIANTS[variant]) setV(variant);
  }, []);

  const hero = VARIANTS[v];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        :root {
          --f-display: 'Playfair Display', Georgia, serif;
          --f-body: 'DM Sans', system-ui, sans-serif;
          --c-bg: #0A0A0A;
          --c-surface: #111111;
          --c-cream: #F5F0E8;
          --c-gold: #C8A97E;
          --c-muted: #6B6B6B;
          --c-glass: rgba(255,255,255,0.04);
          --c-glass-border: rgba(255,255,255,0.08);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { background: var(--c-bg); overflow-x: hidden; }
        ::selection { background: rgba(200,169,126,0.25); color: #fff; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-up { animation: fadeUp 0.8s ease-out both; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.3s; }
        .fade-up-3 { animation-delay: 0.5s; }
        .fade-up-4 { animation-delay: 0.7s; }
        .fade-up-5 { animation-delay: 0.9s; }
        .fade-up-6 { animation-delay: 1.1s; }
      `}</style>

      <div style={{ background: "var(--c-bg)", color: "var(--c-cream)", fontFamily: "var(--f-body)", minHeight: "100vh" }}>

        {/* ═══ NAV ═══ */}
        <nav className="fade-up" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "16px 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-display)", fontSize: "14px", fontWeight: 600, color: "var(--c-cream)" }}>C</div>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--c-cream)", letterSpacing: "0.02em" }}>Carmona OS</span>
            </div>
            <button
              onClick={() => document.getElementById("waitlist-bottom")?.scrollIntoView({ behavior: "smooth" })}
              style={{ padding: "8px 18px", borderRadius: "8px", background: "var(--c-cream)", color: "var(--c-bg)", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "var(--f-body)", letterSpacing: "0.02em" }}
            >
              Get Early Access
            </button>
          </div>
        </nav>

        {/* ═══ HERO ═══ */}
        <section style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
          {/* Background image — desktop: right half, mobile: full with overlay */}
          <div className="hidden md:block" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "48%" }}>
            <img src={IMAGES.hero} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 10%" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, var(--c-bg) 0%, rgba(10,10,10,0.4) 15%, transparent 35%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--c-bg) 0%, transparent 25%)" }} />
          </div>
          <div className="md:hidden" style={{ position: "absolute", inset: 0 }}>
            <img src={IMAGES.hero} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.7) 100%)" }} />
          </div>

          <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 24px", minHeight: "100vh", display: "flex", alignItems: "flex-end", paddingBottom: "80px" }}>
            <div style={{ maxWidth: "560px" }} className="md:pb-16">
              <div className="fade-up fade-up-1" style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-gold)", marginBottom: "20px", fontWeight: 500 }}>
                Launching soon
              </div>
              <h1 className="fade-up fade-up-2" style={{ fontFamily: "var(--f-display)", fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 500, lineHeight: 0.95, color: "var(--c-cream)", marginBottom: "8px" }}>
                {hero.headline}
              </h1>
              <h1 className="fade-up fade-up-2" style={{ fontFamily: "var(--f-display)", fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.95, color: "var(--c-muted)", marginBottom: "28px" }}>
                {hero.headlineMuted}
              </h1>
              <p className="fade-up fade-up-3" style={{ fontSize: "16px", lineHeight: 1.6, color: "var(--c-muted)", marginBottom: "32px", maxWidth: "440px" }}>
                {hero.sub}
              </p>
              <div className="fade-up fade-up-4">
                <EmailCapture variant={`hero-v${v}`} />
              </div>
              <p className="fade-up fade-up-5" style={{ fontSize: "12px", color: "rgba(200,169,126,0.55)", marginTop: "12px" }}>
                Your first workouts are on me.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ VALUE PILLARS ═══ */}
        <section style={{ padding: "48px 24px", borderTop: "1px solid var(--c-glass-border)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                {
                  num: "01",
                  title: "Intentional programming.",
                  body: "A structured arc — not random workouts. Every session has a reason.",
                },
                {
                  num: "02",
                  title: "Personalized at every step.",
                  body: "Your weights. Your macros. A coach's debrief after every session.",
                },
                {
                  num: "03",
                  title: "Fits into your life.",
                  body: "Full sessions or 45 Min mode. Same engine, same standard.",
                },
                {
                  num: "04",
                  title: "Built by a practitioner.",
                  body: "NASM-certified. Classic Physique competitor. 9-5 professional.",
                },
              ].map((p, i) => (
                <div
                  key={i}
                  style={{
                    padding: "20px",
                    borderRadius: "14px",
                    border: "1px solid var(--c-glass-border)",
                    background: "var(--c-glass)",
                  }}
                >
                  <span style={{ fontSize: "9px", letterSpacing: "0.2em", color: "var(--c-gold)", fontWeight: 500 }}>{p.num}</span>
                  <h3 style={{ fontFamily: "var(--f-display)", fontSize: "17px", fontWeight: 500, color: "var(--c-cream)", marginTop: "8px", marginBottom: "6px", lineHeight: 1.2 }}>{p.title}</h3>
                  <p style={{ fontSize: "12px", lineHeight: 1.5, color: "var(--c-muted)" }}>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ APP PEEK — 3 screenshots ═══ */}
        <section style={{ padding: "48px 0 0", borderTop: "1px solid var(--c-glass-border)", overflow: "hidden" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-gold)", fontWeight: 500, textAlign: "center", marginBottom: "20px" }}>Inside the app</p>
            <div style={{ display: "flex", gap: "16px", overflowX: "auto", padding: "0 24px 24px", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none", justifyContent: "center" }}>
            {[
              { src: "/app-onboarding.png", label: "Your program. Built for you." },
              { src: "/app-home.png", label: "Always know what's next." },
              { src: "/app-debrief.png", label: "A coach's take after every session." },
            ].map((s, i) => (
              <div key={i} style={{ flex: "0 0 220px", scrollSnapAlign: "center", textAlign: "center" }}>
                <div style={{ borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", maxHeight: "380px", position: "relative" }}>
                  <img src={s.src} alt={s.label} style={{ width: "100%", display: "block" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to top, var(--c-bg), transparent)" }} />
                </div>
                <p style={{ fontSize: "11px", color: "var(--c-muted)", marginTop: "10px", fontFamily: "var(--f-body)" }}>{s.label}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* ═══ FOUNDER QUOTE ═══ */}
        <section style={{ padding: "64px 24px", borderTop: "1px solid var(--c-glass-border)" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <blockquote style={{ fontFamily: "var(--f-display)", fontSize: "20px", fontStyle: "italic", color: "var(--c-cream)", lineHeight: 1.5, marginBottom: "16px" }}>
              I built Carmona OS because nothing on the market was designed for how I actually live — time-compressed, results-oriented, and unwilling to lower the standard on either side.
            </blockquote>
            <p style={{ fontSize: "13px", color: "var(--c-muted)" }}>
              <span style={{ color: "var(--c-cream)", fontWeight: 500 }}>Matthew Carmona</span>
            </p>
          </div>
        </section>

        {/* ═══ BOTTOM CTA ═══ */}
        <section id="waitlist-bottom" style={{ padding: "80px 24px", borderTop: "1px solid var(--c-glass-border)" }}>
          <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 500, color: "var(--c-cream)", lineHeight: 1.05, marginBottom: "12px" }}>
              Join the waitlist.
            </h2>
            <p style={{ fontSize: "14px", color: "var(--c-muted)", marginBottom: "28px" }}>
              Early access opens soon. Your first workouts are on me.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <EmailCapture variant={`bottom-v${v}`} />
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{ padding: "24px", borderTop: "1px solid var(--c-glass-border)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "4px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-display)", fontSize: "10px", fontWeight: 600, color: "var(--c-cream)" }}>C</div>
              <span style={{ fontSize: "11px", color: "var(--c-muted)" }}>© {new Date().getFullYear()} Carmona OS</span>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <a href="/privacy.html" style={{ fontSize: "11px", color: "var(--c-muted)", textDecoration: "none" }}>Privacy</a>
              <a href="/terms.html" style={{ fontSize: "11px", color: "var(--c-muted)", textDecoration: "none" }}>Terms</a>
              <a href="https://www.instagram.com/carmonafitness" target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "var(--c-muted)", textDecoration: "none" }}>Instagram</a>
              <a href="mailto:hello@matthewcarmona.com" style={{ fontSize: "11px", color: "var(--c-muted)", textDecoration: "none" }}>Support</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
