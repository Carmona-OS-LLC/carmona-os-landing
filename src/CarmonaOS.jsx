import { useState, useEffect } from "react";

// ─── HERO COPY (locked) ─────────────────────────────────────────────────────
const VARIANTS = {
  1: {
    headline: "Results you can't miss.",
    headlineMuted: "A physique people notice.",
    sub: "A training system that learns from the work you actually complete, whether you train the full session or have 45 minutes.",
    credit: "By Matthew Carmona, NASM-certified trainer, competitive bodybuilder, and 9-5er.",
    cta: "Download Carmona OS",
    navCta: "Download",
    note: "Your first six workouts are free. No account needed to start.",
  },
  // Progression-led test page (?v=2). Mirrors the winning ad message from
  // Meta test T1 ("Progression you can see") and puts the free trial up front.
  2: {
    headline: "Progression you can see.",
    headlineMuted: "Every session adapts.",
    sub: "Carmona OS learns from every set you complete, sets your next weights, and shows you what changed and why.",
    credit: "By Matthew Carmona, NASM-certified trainer, competitive bodybuilder, and 9-5er.",
    cta: "Start your 6 free workouts",
    navCta: "Start free",
    note: "Free on the App Store. No account needed to start.",
  },
};

// Feature cards. v2 leads with progression, then 45 Min.
const FEATURES = {
  program: {
    title: "A program that knows what comes next.",
    body: "Every session gives you the exercises, sets, reps, rest and starting weights. Choose Precision, a five-day pre-fatigue split for experienced lifters, or Essentials, a push, pull, legs foundation you can run three to six days a week.",
  },
  time: {
    title: "Full session or a focused 45.",
    body: "Short on time? Switch to 45 Min. The work you complete still counts, and the exercises you don't reach are not held against you.",
  },
  progress: {
    title: "Progress that explains itself.",
    body: "Carmona OS learns from the work you actually complete. Strong sessions can earn you a heavier weight; a near miss holds the weight so you can try again. After every workout, your receipt shows what changed and why.",
  },
  nutrition: {
    title: "Targets you can use today.",
    body: "Personal daily nutrition targets, plus practical playbooks for eating out, lunch and cooking at home.",
  },
};
const FEATURE_ORDER = {
  1: ["program", "time", "progress", "nutrition"],
  2: ["progress", "time", "program", "nutrition"],
};

// "How it adapts" steps (v2 only).
const ADAPT_STEPS = [
  {
    title: "You train.",
    body: "Every session gives you the exercises, sets, reps, rest and starting weights. Train the full session or switch to 45 Min.",
  },
  {
    title: "It learns.",
    body: "Carmona OS reads the work you actually complete. A strong session can earn a heavier weight; a near miss holds the weight so you can try again.",
  },
  {
    title: "You see why.",
    body: "After every workout, your summary shows what changed. The Engine shows where you're progressing and where the app is still learning.",
  },
];

// ─── CONFIG ─────────────────────────────────────────────────────────────────
// App Store Connect campaign link: pt = provider token, ct = campaign.
// ct comes from the visitor's utm_source (plus utm_content, when set, as
// "source-content") so App Analytics can split downloads and paying users by
// channel and ad. Visitors without a source are "website". A page variant
// other than the default (?v=2) is appended as "-v2" so landing-page tests
// can be read in App Analytics too.
const APP_STORE_PROVIDER_TOKEN = "128604529";

function campaignToken() {
  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source") || (params.has("fbclid") ? "meta" : "website");
  const content = params.get("utm_content");
  const variant = params.get("v");
  let token = content ? `${source}-${content}` : source;
  if (variant && variant !== "1") token += `-v${variant}`;
  return token.toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 30) || "website";
}

const APP_STORE_URL = `https://apps.apple.com/us/app/carmona-os/id6759835736?pt=${APP_STORE_PROVIDER_TOKEN}&ct=${campaignToken()}&mt=8`;

const IMAGES = {
  hero: "/hero-cover.jpg",
  proof: "/Matthew_Carmona_020524_0285.jpg",
};

// ─── APP STORE BUTTON ──────────────────────────────────────────────────────
function trackDownload(placement) {
  // Kept on the "Lead" event so ad sets optimizing for it keep working.
  if (typeof window.fbq !== "undefined") {
    window.fbq("track", "Lead", {
      content_name: "app_store_click",
      content_category: placement,
    });
  }
  // OpenAI Ads pixel: "App Store click" conversion (base event Lead created).
  if (typeof window.oaiq !== "undefined") {
    window.oaiq("measure", "lead_created", { type: "customer_action" });
  }
}

function AppStoreButton({ placement, label = "Download Carmona OS" }) {
  return (
    <a
      href={APP_STORE_URL}
      onClick={() => trackDownload(placement)}
      className="inline-block px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
      style={{
        fontFamily: "var(--f-body)",
        background: "var(--c-cream)",
        color: "var(--c-bg)",
        fontSize: "15px",
        textDecoration: "none",
      }}
    >
      {label}
    </a>
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
          --c-bg: #0C0B08;
          --c-surface: #17130D;
          --c-cream: #F3EEE3;
          --c-gold: #D9BE96;
          --c-muted: #AEA593;
          --c-meta: #938979;
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
            <a
              href={APP_STORE_URL}
              onClick={() => trackDownload("nav")}
              style={{ padding: "8px 18px", borderRadius: "8px", background: "var(--c-cream)", color: "var(--c-bg)", fontSize: "12px", fontWeight: 600, textDecoration: "none", fontFamily: "var(--f-body)", letterSpacing: "0.02em" }}
            >
              {hero.navCta}
            </a>
          </div>
        </nav>

        {/* ═══ HERO ═══ */}
        <section style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
          {/* Background image — desktop: right half, mobile: full with overlay */}
          <div className="hidden md:block" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "48%" }}>
            <img src={IMAGES.hero} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 10%" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, var(--c-bg) 0%, rgba(12,11,8,0.4) 15%, transparent 35%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--c-bg) 0%, transparent 25%)" }} />
          </div>
          <div className="md:hidden" style={{ position: "absolute", inset: 0 }}>
            <img src={IMAGES.hero} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,11,8,0.95) 0%, rgba(12,11,8,0.6) 50%, rgba(12,11,8,0.7) 100%)" }} />
          </div>

          <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 24px", minHeight: "100vh", display: "flex", alignItems: "flex-end", paddingBottom: "80px" }}>
            <div style={{ maxWidth: "560px" }} className="md:pb-16">
              <div className="fade-up fade-up-1" style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-gold)", marginBottom: "20px", fontWeight: 500 }}>
                Now on the App Store
              </div>
              <h1 className="fade-up fade-up-2" style={{ fontFamily: "var(--f-display)", fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 500, lineHeight: 0.95, color: "var(--c-cream)", marginBottom: "8px" }}>
                {hero.headline}
              </h1>
              <h1 className="fade-up fade-up-2" style={{ fontFamily: "var(--f-display)", fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.95, color: "var(--c-meta)", marginBottom: "28px" }}>
                {hero.headlineMuted}
              </h1>
              <p className="fade-up fade-up-3" style={{ fontSize: "16px", lineHeight: 1.6, color: "var(--c-muted)", marginBottom: "32px", maxWidth: "440px" }}>
                {hero.sub}
              </p>
              <div className="fade-up fade-up-4">
                <AppStoreButton placement={`hero-v${v}`} label={hero.cta} />
              </div>
              <p className="fade-up fade-up-5" style={{ fontSize: "12px", color: "var(--c-gold)", marginTop: "14px" }}>
                {hero.note}
              </p>
              <p className="fade-up fade-up-6" style={{ fontSize: "12px", lineHeight: 1.55, color: "var(--c-muted)", marginTop: "24px", maxWidth: "440px" }}>
                {hero.credit}
              </p>
            </div>
          </div>
        </section>

        {/* ═══ HOW IT ADAPTS (v2) ═══ */}
        {v === 2 && (
          <section style={{ padding: "72px 24px", borderTop: "1px solid var(--c-glass-border)" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div style={{ maxWidth: "640px", marginBottom: "40px" }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-gold)", fontWeight: 500, marginBottom: "18px" }}>
                  How it adapts
                </p>
                <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(28px, 4.5vw, 40px)", fontWeight: 500, color: "var(--c-cream)", lineHeight: 1.1, marginBottom: "20px" }}>
                  Your next session is built from your last one.
                </h2>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "var(--c-muted)" }}>
                  No guessing what weight to use next, and no random workouts. Set your baseline, and then the app tells you what's next based on what you actually lift.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "40px", alignItems: "center" }}>
                <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "28px" }}>
                  {ADAPT_STEPS.map((step, i) => (
                    <li key={i} style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: "14px" }}>
                      <span style={{ width: "36px", height: "36px", borderRadius: "999px", border: "1px solid var(--c-gold)", color: "var(--c-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 500 }}>{i + 1}</span>
                      <div>
                        <h3 style={{ fontFamily: "var(--f-display)", fontSize: "20px", fontWeight: 500, color: "var(--c-cream)", lineHeight: 1.2, marginBottom: "6px" }}>{step.title}</h3>
                        <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--c-muted)" }}>{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                  {[
                    { src: "/app-4-trustworthy-receipt.jpg", label: "Your summary after every workout." },
                    { src: "/app-5-engine-progress.jpg", label: "The Engine: where you're progressing." },
                  ].map((s, i) => (
                    <figure key={i} style={{ flex: "1 1 0", maxWidth: "230px", minWidth: 0, textAlign: "center" }}>
                      <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <img src={s.src} alt={s.label} style={{ width: "100%", display: "block" }} />
                      </div>
                      <figcaption style={{ fontSize: "12px", color: "var(--c-muted)", marginTop: "12px" }}>{s.label}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: "48px", padding: "20px 24px", borderRadius: "14px", border: "1px solid var(--c-glass-border)", background: "var(--c-surface)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--f-display)", fontSize: "20px", color: "var(--c-cream)", marginBottom: "4px" }}>Your first six workouts are free.</p>
                  <p style={{ fontSize: "13px", color: "var(--c-muted)" }}>Then $14.99 a month or $119.99 a year. No account needed to start.</p>
                </div>
                <AppStoreButton placement={`adapt-v${v}`} label={hero.cta} />
              </div>
            </div>
          </section>
        )}

        {/* ═══ THE PROMISE ═══ */}
        <section style={{ padding: "72px 24px 48px", borderTop: "1px solid var(--c-glass-border)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ maxWidth: "640px", marginBottom: "40px" }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-gold)", fontWeight: 500, marginBottom: "18px" }}>
                What is waiting for you
              </p>
              <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(28px, 4.5vw, 40px)", fontWeight: 500, color: "var(--c-cream)", lineHeight: 1.1, marginBottom: "20px" }}>
                A real program for lifters.
              </h2>
              <p style={{ fontSize: "15px", lineHeight: 1.6, color: "var(--c-muted)" }}>
                Built around one question: what should I do next? Choose Precision or Essentials, then train the full session or switch to 45 Min when time is tight.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "12px" }}>
              {FEATURE_ORDER[v].map((key, i) => ({ num: String(i + 1).padStart(2, "0"), ...FEATURES[key] })).map((p, i) => (
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
                  <p style={{ fontSize: "13px", lineHeight: 1.55, color: "var(--c-muted)" }}>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ APP PEEK — App Store screenshots ═══ */}
        <section style={{ padding: "64px 0 0", borderTop: "1px solid var(--c-glass-border)", overflow: "hidden" }}>
          <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-gold)", fontWeight: 500, textAlign: "center", marginBottom: "28px" }}>Inside the app</p>
            <div style={{ display: "flex", gap: "20px", overflowX: "auto", padding: "0 24px 32px", scrollSnapType: "x mandatory", scrollPaddingLeft: "24px", WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none", justifyContent: "flex-start" }}>
            {[
              { src: "/app-1-home-next-workout.jpg", label: "Your next workout, ready when you are." },
              { src: "/app-2-workouts-full-or-45.jpg", label: "Full session or a focused 45." },
              { src: "/app-3-active-set.jpg", label: "Sets, reps and starting weights for every lift." },
              { src: "/app-4-trustworthy-receipt.jpg", label: "A receipt after every workout: what changed and why." },
              { src: "/app-5-engine-progress.jpg", label: "The Engine shows where you're progressing." },
              { src: "/app-6-nutrition-daily-targets.jpg", label: "Daily targets and playbooks for eating out." },
            ].map((s, i) => (
              <div key={i} style={{ flex: "0 0 240px", scrollSnapAlign: "start", textAlign: "center" }}>
                <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", maxHeight: "520px", position: "relative" }}>
                  <img src={s.src} alt={s.label} style={{ width: "100%", display: "block" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to top, var(--c-bg), transparent)" }} />
                </div>
                <p style={{ fontSize: "12px", color: "var(--c-muted)", marginTop: "14px", fontFamily: "var(--f-body)" }}>{s.label}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* ═══ FROM MATTHEW ═══ */}
        <section style={{ padding: "80px 24px", borderTop: "1px solid var(--c-glass-border)" }}>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-gold)", fontWeight: 500, marginBottom: "18px" }}>
              From Matthew
            </p>
            <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 500, color: "var(--c-cream)", lineHeight: 1.15, marginBottom: "24px" }}>
              I built the app that I wanted to use.
            </h2>
            <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--c-muted)" }}>
              I didn't want another PDF or a set of random workouts with no throughline. I wanted programming that evolved with me—and that reflects how I plan my own workouts. Carmona OS is what I built. It offers real programming, real progression, and a receipt after every workout that explains what changed. And the workouts adapt to my schedule: full workouts when I have time, 45 Min mode when I don't.
            </p>
          </div>
        </section>

        {/* ═══ SOCIAL PROOF ═══ */}
        <section style={{ padding: "64px 24px", borderTop: "1px solid var(--c-glass-border)" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <blockquote style={{ fontFamily: "var(--f-display)", fontSize: "20px", fontStyle: "italic", color: "var(--c-cream)", lineHeight: 1.5, marginBottom: "16px" }}>
              "It really feels like having a personal trainer. I don't want to research. I just want someone to tell me what to do."
            </blockquote>
            <p style={{ fontSize: "13px", color: "var(--c-muted)" }}>
              <span style={{ color: "var(--c-cream)", fontWeight: 500 }}>Cody</span> · Carmona OS subscriber
            </p>
          </div>
        </section>

        {/* ═══ BOTTOM CTA ═══ */}
        <section id="download" style={{ padding: "80px 24px", borderTop: "1px solid var(--c-glass-border)" }}>
          <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 500, color: "var(--c-cream)", lineHeight: 1.05, marginBottom: "12px" }}>
              Your first six workouts are free.
            </h2>
            <p style={{ fontSize: "14px", color: "var(--c-muted)", marginBottom: "28px" }}>
              Download it, pick your program, and start Workout 1 today.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <AppStoreButton placement={`bottom-v${v}`} label={hero.cta} />
            </div>
            <p style={{ fontSize: "12px", color: "var(--c-muted)", marginTop: "18px" }}>
              Free on the App Store. No account needed to start.
            </p>
            <p style={{ fontSize: "11px", lineHeight: 1.6, color: "var(--c-muted)", opacity: 0.75, marginTop: "28px" }}>
              After your six free workouts, continue from Workout 7 with Carmona OS Premium, $14.99 a month or $119.99 a year.
            </p>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{ padding: "24px", borderTop: "1px solid var(--c-glass-border)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "4px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-display)", fontSize: "10px", fontWeight: 600, color: "var(--c-cream)" }}>C</div>
              <span style={{ fontSize: "11px", color: "var(--c-muted)" }}>© {new Date().getFullYear()} Carmona OS LLC</span>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <a href="/privacy" style={{ fontSize: "11px", color: "var(--c-muted)", textDecoration: "none" }}>Privacy</a>
              <a href="/terms" style={{ fontSize: "11px", color: "var(--c-muted)", textDecoration: "none" }}>Terms</a>
              <a href="https://www.instagram.com/carmona" target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "var(--c-muted)", textDecoration: "none" }}>Instagram</a>
              <a href="mailto:support@carmonaos.com" style={{ fontSize: "11px", color: "var(--c-muted)", textDecoration: "none" }}>Support</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
