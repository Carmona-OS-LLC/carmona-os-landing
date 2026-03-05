import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ─── BRAND CONSTANTS ─────────────────────────────────────────────────────────

// ─── IMAGES ──────────────────────────────────────────────────────────────────
const IMAGES = {
  hero2400: "/hero-cover.jpg",
  abs: "/Matthew_Carmona_051324_0188.jpg",
  hero: "/hero-cover.jpg",
  shoulders: "/untitled-16.jpg",
  legs: "/Matthew_Carmona_061223_0268.jpg.jpeg",
  back: "/Matthew_Carmona_020524_0285.jpg",
  aux: "/biceps.jpeg",
  watch: "/biceps.jpeg",
  tank: "/Abs.png",
  profile: "/Abs.png",
};
// PRODUCTION: Replace these with your CDN URLs.
// Export hero-cover.jpg at TWO sizes:
//   • hero-cover-1200.jpg  → 1200px wide, quality 80 (mobile)
//   • hero-cover-2400.jpg  → 2400px wide, quality 75 (desktop/retina)
// Export watch photo at 800px wide, quality 80.
// Export profile crop at 120×120px, quality 80.
//
// For the artifact preview, we use placeholder gradients.



const HAS_IMAGES = !!IMAGES.hero;

// ─── BRAND CONSTANTS ─────────────────────────────────────────────────────────

const B = {
  bg: "#0A0A0A",
  surface: "#111111",
  accent: "#E8E8E8",
  muted: "#6B6B6B",
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
};

const font = {
  display: "'Playfair Display', serif",
  body: "'Inter', sans-serif",
};

// ─── IMAGES ──────────────────────────────────────────────────────────────────



// ─── DATA ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "45", unit: "min", label: "Sessions. Full volume." },
  { value: "5", unit: "", label: "Training days. Zero redundancy." },
  { value: "Intelligent", unit: "", label: "Every session adapts to you." },
];

const FEATURES = [
  {
    label: "The Engine",
    title: "The system knows when to push and when to hold.",
    body: "Behind every session, Carmona OS runs a real-time progression engine. It tracks your reps, your weight, and your consistency — and tells you exactly when to add load and when to reinforce. And before you start, it tells you why this workout exists in your arc right now. You always know where you are in the program, not just what you're doing today.",
    imgKey: null,
  },
  {
    label: "Matthew's Take",
    title: "Not content. The actual reasoning behind your program.",
    body: "Every week, a direct drop from Matthew — NASM-certified trainer, competitive physique athlete, former Meta executive. Not motivational copy. Not generic fitness advice. The inside reasoning on why your sessions are built the way they are, what the current phase is targeting, and what he's thinking about your arc right now. Most coaches charge for this access. It's built into your subscription.",
    imgKey: "profile",
  },
  {
    label: "Before & Now",
    title: "See exactly what's being built.",
    body: "Carmona OS tracks your transformation over time and reflects it back to you — clearly. Not volume graphs. Not spreadsheets. A direct read on where you were, what changed, and what the program is targeting next. The Progress view is a mirror. You'll always know if it's working.",
    imgKey: null,
  },
  {
    label: "Protocol",
    title: "Your macros. Calibrated. Front and center.",
    body: "The Protocol tab delivers your personal macro targets based on your calibration — not population averages. This is the difference between knowing your numbers and actually hitting them. Built for people who track because they've decided to be precise, not because they have to.",
    imgKey: "abs",
  },
  {
    label: "The Debrief",
    title: "After every session, your coach weighs in.",
    body: "Carmona OS generates a post-workout debrief after every session — written in Matthew's voice, based on what actually happened in your workout. Not a summary. An interpretation. 'You pushed a rep PR on incline. Here's what it means for next week.' The system pays attention so you don't have to wonder.",
    imgKey: null,
  },
];

const PRICING_FEATURES = [
  "Intelligent 5-day programming",
  "Post-session debrief in Matthew's voice",
  "Personalized macro targets",
  "Protocol nutrition system",
  "Matthew's Take weekly editorial",
  "Before & Now progress tracking",
  "Program arc visibility",
  "Double-progression engine",
];

const FAQ_DATA = [
  { q: "Do I need to be advanced?", a: "No — but you need to be serious. Carmona OS is built for people training with intent. If you've been going to the gym consistently and want a system precise enough to actually move the needle on your physique, this will do it." },
  { q: "What equipment do I need?", a: "A commercial gym. Barbells, cables, machines — the full toolkit. This is not a home workout program." },
  { q: "How is this different from RP Hypertrophy or Caliber?", a: "RP is science-heavy and manual — it asks a lot from you. Caliber is coach-dependent and costs 10x as much. Carmona OS runs itself, adapts to your data, and gives you a coach's interpretation after every session. One methodology, one voice, no work on your end beyond showing up." },
  { q: "Can I cancel?", a: "Yes, anytime. No contracts, no friction. Access continues until the end of your billing period." },
];

// ─── PRIMITIVES ──────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "", y = 30 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GlassCard({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border backdrop-blur-md ${className}`}
      style={{ background: B.glass, borderColor: B.glassBorder }}
      {...props}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <span
      className="inline-block text-xs tracking-[0.3em] uppercase mb-6 px-4 py-1.5 rounded-full border font-medium"
      style={{ color: B.muted, borderColor: B.glassBorder, background: B.glass, fontFamily: font.body }}
    >
      {children}
    </span>
  );
}

function CTAButton({ children, variant = "primary", className = "", ...props }) {
  const isPrimary = variant === "primary";
  return (
    <button
      className={`px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${className}`}
      style={{
        fontFamily: font.body,
        background: isPrimary ? B.accent : "transparent",
        color: isPrimary ? B.bg : B.muted,
        border: isPrimary ? "none" : `1px solid ${B.glassBorder}`,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function SectionDivider() {
  return (
    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${B.glassBorder}, transparent)` }} />
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex items-center justify-between px-6 py-4 max-w-6xl" style={{ fontFamily: font.body }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: B.glassBorder, color: B.accent, fontFamily: font.display }}>C</div>
          <span className="text-sm font-medium" style={{ color: B.accent }}>Carmona OS</span>
        </div>
        <button className="px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03]" style={{ fontFamily: font.body, background: B.accent, color: B.bg }}>
          Start Your Protocol
        </button>
      </div>
    </motion.nav>
  );
}

function StickyMobileCTA({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ duration: 0.3 }} className="fixed bottom-0 left-0 right-0 z-50 sm:hidden p-4" style={{ background: `linear-gradient(to top, ${B.bg} 60%, transparent)` }}>
          <button className="w-full py-3.5 rounded-full text-sm font-semibold tracking-wide" style={{ fontFamily: font.body, background: B.accent, color: B.bg }}>
            Start Your Protocol — $19.99/mo
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: B.bg }}>
      <div className="absolute inset-0 opacity-[0.02] z-[1]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="absolute inset-0 md:hidden">
        <img src={IMAGES.hero2400} alt="" className="w-full h-full" style={{ objectFit: "cover", objectPosition: "50% 15%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.6) 70%, rgba(10,10,10,0.7) 100%)" }} />
      </div>
      <div className="hidden md:block absolute top-0 right-0 bottom-0 w-[50%] lg:w-[45%]">
        <img src={IMAGES.hero2400} alt="" className="w-full h-full" style={{ objectFit: "cover", objectPosition: "50% 10%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,10,10,1) 0%, rgba(10,10,10,0.6) 8%, transparent 25%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 30%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 30%, transparent 40%, rgba(10,10,10,0.3) 100%)" }} />
      </div>
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 min-h-screen flex items-end md:items-center">
        <div className="pb-24 pt-48 sm:pt-56 md:pt-0 md:pb-0 md:max-w-[55%] lg:max-w-[50%]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <SectionLabel>Carmona OS v3.1</SectionLabel>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8" style={{ fontFamily: font.display, color: B.accent }}>
            The Operating<br />System<br />
            <span className="italic font-normal" style={{ color: B.muted, textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>for the Ambitious Few.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="text-lg sm:text-xl max-w-xl mb-4 leading-relaxed font-medium" style={{ fontFamily: font.body, color: B.accent, textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}>
            The chest. The quads. The shoulders. There's a recipe. This is it.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.85 }} className="text-base max-w-xl mb-12 leading-relaxed" style={{ fontFamily: font.body, color: B.muted, textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}>
            Intelligent programming. A progression engine that adapts to your data. This coach's voice after every session.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.0 }} className="flex flex-wrap gap-4">
            <CTAButton>Start Your Protocol →</CTAButton>
            <CTAButton variant="ghost">See How It Works ↓</CTAButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS BAR ───────────────────────────────────────────────────────────────

function StatsBar() {
  return (
    <section className="relative py-16 px-6" style={{ background: B.surface }}>
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center">
        {STATS.map((s, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: font.display, color: B.accent }}>{s.value}</span>
                {s.unit && <span className="text-lg" style={{ fontFamily: font.body, color: B.muted }}>{s.unit}</span>}
              </div>
              <span className="text-xs tracking-wide uppercase" style={{ fontFamily: font.body, color: B.muted }}>{s.label}</span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ─── THE RECIPE (NEW SECTION 04) ─────────────────────────────────────────────

function RecipeSection() {
  return (
    <section className="relative py-28 px-6">
      <SectionDivider />
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <FadeIn><SectionLabel>The Methodology</SectionLabel></FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-[1.05]" style={{ fontFamily: font.display, color: B.accent }}>
              Most programs give you exercises.<br />
              <span className="italic font-normal" style={{ color: B.muted }}>This one gives you a system.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-base leading-relaxed" style={{ fontFamily: font.body, color: B.muted }}>
              Carmona OS is built on a single principle: aesthetic results are engineered, not accumulated. Every session is part of a deliberate arc — compound foundations, progressive overload timed to your data, targeted volume phases that build the specific proportions you're after. The chest isn't just trained. It's architected. So are the shoulders. So are the quads. This is the recipe.
            </p>
          </FadeIn>
        </div>
        <FadeIn delay={0.3}>
          <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
            <img src={IMAGES.back} alt="Back detail" className="w-full h-full object-cover" style={{ filter: "brightness(0.85)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 40%)" }} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── FEATURES ────────────────────────────────────────────────────────────────

function FeaturesSection() {
  return (
    <section className="relative py-28 px-6">
      <SectionDivider />
      <div className="max-w-5xl mx-auto">
        {FEATURES.map((f, i) => (
          <div key={i} className={`grid md:grid-cols-2 gap-12 items-center ${i > 0 ? "mt-28" : ""} ${f.imgKey && i % 2 !== 0 ? "md:direction-rtl" : ""}`}>
            <div className={f.imgKey && i % 2 !== 0 ? "md:order-2" : ""}>
              <FadeIn><SectionLabel>{f.label}</SectionLabel></FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-[1.1]" style={{ fontFamily: font.display, color: B.accent }}>{f.title}</h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-base leading-relaxed" style={{ fontFamily: font.body, color: B.muted }}>{f.body}</p>
              </FadeIn>
            </div>
            {f.imgKey ? (
              <FadeIn delay={0.3} className={f.imgKey && i % 2 !== 0 ? "md:order-1" : ""}>
                <div className="relative rounded-2xl overflow-hidden aspect-square">
                  <img src={IMAGES[f.imgKey]} alt="" className="w-full h-full object-cover" style={{ filter: f.imgKey === "abs" ? "brightness(0.9)" : "brightness(0.8)" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.4) 0%, transparent 40%)" }} />
                </div>
              </FadeIn>
            ) : (
              <FadeIn delay={0.3}>
                <GlassCard className="p-8 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: B.glassBorder }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={B.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: font.body, color: B.muted }}>{f.label}</span>
                  </div>
                </GlassCard>
              </FadeIn>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PROGRAM ARC (NEW SECTION 06) ────────────────────────────────────────────

function ProgramArc() {
  return (
    <section className="relative py-28 px-6">
      <SectionDivider />
      <div className="max-w-4xl mx-auto text-center">
        <FadeIn><SectionLabel>The Arc</SectionLabel></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-[1.05]" style={{ fontFamily: font.display, color: B.accent }}>
            Week 1 builds the foundation.<br />
            <span className="italic font-normal" style={{ color: B.muted }}>Week 8 carves the detail.</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-base mb-16 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: font.body, color: B.muted }}>
            Carmona OS runs a periodized arc — a deliberate progression from compound strength work through targeted volume to refinement phases. You always know where you are in the program and why the current phase is what it is. This is what separates a training system from a workout generator. You're not just doing sessions. You're building something.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
            {["Foundation", "Volume", "Intensity", "Refinement"].map((phase, i) => (
              <div key={i} className="text-center">
                <div className="h-2 rounded-full mb-3" style={{ background: `rgba(232,232,232,${0.15 + i * 0.15})` }} />
                <span className="text-[10px] tracking-[0.15em] uppercase" style={{ fontFamily: font.body, color: B.muted }}>{phase}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── PROOF & FOUNDER ─────────────────────────────────────────────────────────

function ProofSection() {
  return (
    <section className="relative py-28 px-6">
      <SectionDivider />
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <FadeIn>
          <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
            <img src={IMAGES.legs} alt="Full physique" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.3) 0%, transparent 40%)" }} />
          </div>
        </FadeIn>
        <div>
          <FadeIn delay={0.1}>
            <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="mb-6"><path d="M0 24V14.4C0 6.4 5.6 1.6 14 0l1.4 3.2C10 5.6 7.6 9.6 7.2 14.4H14V24H0zm18 0V14.4C18 6.4 23.6 1.6 32 0l1.4 3.2C28 5.6 25.6 9.6 25.2 14.4H32V24H18z" fill="rgba(255,255,255,0.08)"/></svg>
            <p className="text-xl sm:text-2xl leading-relaxed mb-8 italic" style={{ fontFamily: font.display, color: B.accent }}>
              I built this because nothing on the market was designed for how I actually live — time-compressed, results-oriented, and unwilling to lower the standard on either side.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-sm leading-relaxed" style={{ fontFamily: font.body, color: B.muted }}>
              <span style={{ color: B.accent }}>Matthew Carmona.</span> NASM-CPT. Competitive physique athlete. Former VP, Meta. Harvard. Stanford GSB.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ─────────────────────────────────────────────────────────────────

function Pricing() {
  return (
    <section id="pricing" className="relative py-28 px-6">
      <SectionDivider />
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <FadeIn><SectionLabel>Pricing</SectionLabel></FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-[1.05]" style={{ fontFamily: font.display, color: B.accent }}>
              One price.<br /><span className="italic font-normal" style={{ color: B.muted }}>The full system.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <GlassCard className="p-8 sm:p-10">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-bold" style={{ fontFamily: font.display, color: B.accent }}>$19.99</span>
                <span className="text-base" style={{ fontFamily: font.body, color: B.muted }}>/mo</span>
              </div>
              <p className="text-xs mb-8" style={{ fontFamily: font.body, color: "rgba(255,255,255,0.3)" }}>Founding Member Rate · Locks your price permanently</p>
              <div className="space-y-3 mb-8">
                {PRICING_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0"><path d="M20 6L9 17l-5-5" stroke={B.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="text-sm" style={{ fontFamily: font.body, color: B.muted }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" style={{ fontFamily: font.body, background: B.accent, color: B.bg }}>
                Initialize Your Protocol →
              </button>
              <p className="text-xs text-center mt-4" style={{ fontFamily: font.body, color: "rgba(255,255,255,0.2)" }}>Cancel anytime. No contracts. No friction.</p>
            </GlassCard>
          </FadeIn>
        </div>
        <FadeIn delay={0.3}>
          <div className="relative rounded-2xl overflow-hidden aspect-[3/4] hidden md:block">
            <img src={IMAGES.aux} alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.8)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.4) 0%, transparent 40%)" }} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="relative py-28 px-6">
      <SectionDivider />
      <div className="max-w-3xl mx-auto">
        <FadeIn><SectionLabel>FAQ</SectionLabel></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-4xl sm:text-5xl font-bold mb-16 leading-[1.05]" style={{ fontFamily: font.display, color: B.accent }}>
            Questions.<br /><span className="italic font-normal" style={{ color: B.muted }}>Answered.</span>
          </h2>
        </FadeIn>
        <div className="space-y-2">
          {FAQ_DATA.map((faq, i) => (
            <FadeIn key={i} delay={0.1 + i * 0.05}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left">
                <GlassCard className="p-6 transition-all duration-300 hover:border-white/15">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base font-medium" style={{ fontFamily: font.body, color: B.accent }}>{faq.q}</span>
                    <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }} className="text-xl flex-shrink-0" style={{ color: B.muted }}>+</motion.span>
                  </div>
                  <AnimatePresence>
                    {open === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <p className="text-sm leading-relaxed mt-4 pt-4" style={{ fontFamily: font.body, color: B.muted, borderTop: `1px solid ${B.glassBorder}` }}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FINAL CTA ───────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative py-32 px-6">
      <SectionDivider />
      <div className="max-w-4xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[0.95]" style={{ fontFamily: font.display, color: B.accent }}>
            Your physique is a design decision.<br />
            <span className="italic font-normal" style={{ color: B.muted }}>Make it.</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-base mb-10 leading-relaxed max-w-xl mx-auto" style={{ fontFamily: font.body, color: B.muted }}>
            Carmona OS is built for one kind of person — someone who holds themselves to a high standard and wants a training tool that does the same. The recipe exists. The system is ready. The only thing missing is you.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <CTAButton>Initialize Your Protocol →</CTAButton>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-12 px-6" style={{ borderTop: `1px solid ${B.glassBorder}` }}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: B.glassBorder, color: B.accent, fontFamily: font.display }}>C</div>
          <span className="text-xs" style={{ fontFamily: font.body, color: B.muted }}>Carmona OS</span>
        </div>
        <span className="text-xs" style={{ fontFamily: font.body, color: "rgba(255,255,255,0.2)" }}>© {new Date().getFullYear()} Carmona OS. All rights reserved.</span>
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function CarmonaOS() {
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const fn = () => setPastHero(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #0A0A0A; -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(255,255,255,0.15); color: #fff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
      `}</style>
      <div className="min-h-screen w-full" style={{ background: B.bg, color: B.accent, fontFamily: font.body }}>
        <Nav />
        <StickyMobileCTA visible={pastHero} />
        <Hero />
        <StatsBar />
        <RecipeSection />
        <FeaturesSection />
        <ProgramArc />
        <ProofSection />
        <Pricing />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
