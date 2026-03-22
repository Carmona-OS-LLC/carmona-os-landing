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
  back: "/Abs.png",
  aux: "/Matthew_Carmona_020524_0285.jpg",
  watch: "/biceps.jpeg",
  tank: "/Abs.png",
  profile: "/biceps.jpeg",
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
  { value: "2", unit: "", label: "Training tracks. Your choice." },
  { value: "90+", unit: "", label: "Exercises. Intelligently rotated." },
];

const FEATURES = [
  {
    label: "The Engine",
    title: "The system knows when to push and when to hold.",
    body: "Behind every session, Carmona OS runs a real-time progression engine. It tracks your reps, your weight, and your consistency — and tells you exactly when to add load and when to reinforce. And before you start, it tells you why this workout exists in your arc right now. You always know where you are in the program, not just what you're doing today.",
    imgKey: null,
  },
  {
    label: "Carmona AI",
    title: "Your coach. Always on. Never generic.",
    body: "CarmonAI is Matthew's voice, built into the app. Ask anything — what to order at a client dinner, how to adjust when you're traveling, what this exercise is building and why it's in your program today. It has your full context: your track, your block, your recent sessions, your macros. No generic answers. No hedging. The kind of directness you'd pay a real coach for, available between every set.",
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
  "Two tracks: Essentials (PPL) + Carmona Method (5-day)",
  "90+ exercises with intelligent rotation and recency-based variety",
  "CarmonAI — your personal coach, always in context",
  "AI post-session debrief in Matthew's voice",
  "Double-progression engine with auto-promotion",
  "Multi-block periodization (Onramp → Accumulation → Specialization)",
  "Personalized macro targets and nutrition protocol",
  "Full sessions (55–60 min) + 45 Min mode for time-compressed days",
];

const FAQ_DATA = [
  { q: "Do I need to be advanced?", a: "No — but you need to be serious. Carmona OS is built for people training with intent. The Foundation tier is designed for those returning to the gym or starting fresh. If you're ready to train with a system instead of improvising, this is built for you." },
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
        <button className="px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03]" style={{ fontFamily: font.body, background: B.accent, color: B.bg }} onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}>
          Join Waitlist
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
          <button className="w-full py-3.5 rounded-full text-sm font-semibold tracking-wide" style={{ fontFamily: font.body, background: B.accent, color: B.bg }} onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}>
            Join Waitlist — $19.99/mo
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
            <CTAButton onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}>Start Your Protocol →</CTAButton>
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

// ─── TWO TRACKS ──────────────────────────────────────────────────────────────

function TwoTracks() {
  return (
    <section style={{ background: B.bg, padding: "80px 0 60px" }}>
      <div className="max-w-3xl mx-auto px-6">
        <FadeIn><SectionLabel>Two Tracks</SectionLabel></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-[1.1]" style={{ fontFamily: font.display, color: B.accent }}>
            Choose how you train.<br />
            <span className="italic font-normal" style={{ color: B.muted }}>Switch anytime.</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-sm leading-relaxed mb-10" style={{ fontFamily: font.body, color: B.muted }}>
            Two philosophies. Same exercise pool. Same progression engine. Same standard.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FadeIn delay={0.2}>
            <div className="rounded-2xl p-6 h-full" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,169,126,0.25)" }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ fontFamily: font.body, color: "#C8A97E" }}>Essentials</p>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: font.display, color: B.accent }}>The foundation.</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: font.body, color: B.muted }}>
                Push / Pull / Legs. Compound-first sequencing. Three experience tiers — Foundation, Growth, Peak — that scale with you. Every set productive. The most efficient path to looking great.
              </p>
              <div className="flex flex-wrap gap-2">
                {["3-day PPL rotation", "Compound-first", "3 tiers"].map(t => (
                  <span key={t} className="text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full" style={{ fontFamily: font.body, color: "rgba(200,169,126,0.6)", border: "1px solid rgba(200,169,126,0.15)" }}>{t}</span>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="rounded-2xl p-6 h-full" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ fontFamily: font.body, color: "rgba(255,255,255,0.5)" }}>The Carmona Method</p>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: font.display, color: B.accent }}>The evolution.</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: font.body, color: B.muted }}>
                5-day modified antagonist split. Machine and cable dominant. Pre-exhaust openers. Lengthened-position emphasis. The programming that's still producing gains after 25 years. High volume. High intent.
              </p>
              <div className="flex flex-wrap gap-2">
                {["5-day split", "Pre-exhaust", "Machine dominant"].map(t => (
                  <span key={t} className="text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full" style={{ fontFamily: font.body, color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}>{t}</span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ────────────────────────────────────────────────────────────────



// ─── FEATURE MOCKUP COMPONENTS (v2 — matches actual app) ────────────────────

function EngineMockup() {
  const exercises = [
    { name: "Barbell Bench Press", sets: "3 × 8", weight: "185 lb", tag: "Horizontal Mass", status: "▲ Promote", statusColor: "#4ADE80", statusBg: "rgba(74,222,128,0.1)" },
    { name: "Incline Dumbbell Press", sets: "3 × 10", weight: "75 lb", tag: "Upper Shelf", status: "● Hold", statusColor: "rgba(255,255,255,0.4)", statusBg: "rgba(255,255,255,0.04)" },
    { name: "Incline Dumbbell Fly", sets: "2 × 12", weight: "35 lb", tag: "Upper Chest Isolation", status: "▲ Promote", statusColor: "#4ADE80", statusBg: "rgba(74,222,128,0.1)" },
    { name: "Cable Overhead Extension", sets: "2 × 12", weight: "50 lb", tag: "Tricep Long Head", status: "● Reinforce", statusColor: "#C8A97E", statusBg: "rgba(200,169,126,0.08)" },
  ];
  return (
    <div className="rounded-2xl overflow-hidden aspect-square flex flex-col" style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-5 pt-5 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif" }}>Next Session</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(200,169,126,0.08)", color: "#C8A97E", fontFamily: "'Inter', sans-serif" }}>Block 2 · Ramp</span>
        </div>
        <span className="text-base font-medium" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Playfair Display', serif" }}>Push</span>
        <div className="flex gap-3 mt-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}>7 exercises</span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}>~55 min</span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full" style={{ border: "1px solid rgba(200,169,126,0.15)", color: "#C8A97E", fontFamily: "'Inter', sans-serif" }}>Full</span>
        </div>
      </div>
      <div className="flex-1 px-5 py-3 space-y-0 overflow-hidden">
        {exercises.map((ex, i) => (
          <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <div>
              <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'Inter', sans-serif" }}>{ex.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Inter', sans-serif" }}>{ex.sets} · {ex.weight}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.25)", fontFamily: "'Inter', sans-serif" }}>{ex.tag}</span>
              </div>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: ex.statusBg, color: ex.statusColor, fontFamily: "'Inter', sans-serif" }}>{ex.status}</span>
          </div>
        ))}
      </div>
      <div className="px-5 py-3" style={{ background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="w-full py-3 rounded-xl text-center text-sm font-semibold" style={{ background: "white", color: "#0A0A0A", fontFamily: "'Inter', sans-serif" }}>Start Workout</div>
      </div>
    </div>
  );
}

function BeforeNowMockup() {
  const rotationData = [
    { name: "Incline DB", weeks: [true, true, true, false] },
    { name: "Cable Flye", weeks: [true, false, true, true] },
    { name: "Hammer Curl", weeks: [false, true, false, true] },
    { name: "Lat Raise", weeks: [true, true, false, true] },
  ];
  const progressionEvents = [
    { exercise: "Incline DB Press", detail: "Ready to promote — 75 lbs", type: "weight" },
    { exercise: "Seated Row", detail: "3 consecutive sessions at target reps", type: "rep" },
  ];
  const phaseColor = "#C8A97E";
  return (
    <div className="rounded-2xl overflow-hidden aspect-square flex flex-col" style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-5 pt-5 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-base font-medium" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Playfair Display', serif" }}>Training Arc</span>
          <span className="text-[10px] font-semibold tracking-[0.15em] uppercase" style={{ color: phaseColor, fontFamily: "'Inter', sans-serif" }}>Block 2</span>
        </div>
        <div className="flex mt-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          {[["Rotation", true], ["Progression", false], ["Next Block", false]].map(([label, active]) => (
            <span key={label} className="text-[11px] pb-2 mr-4" style={{ color: active ? "#F5F5F5" : "#808080", fontWeight: active ? 600 : 400, borderBottom: active ? `2px solid ${phaseColor}` : "2px solid transparent", fontFamily: "'Inter', sans-serif" }}>{label}</span>
          ))}
        </div>
      </div>
      <div className="flex-1 px-5 py-3 overflow-hidden">
        <div className="flex items-center gap-3 mb-3 p-2.5 rounded-xl" style={{ background: `${phaseColor}08`, borderLeft: `3px solid ${phaseColor}` }}>
          <span className="text-sm" style={{ opacity: 0.7 }}>🔒</span>
          <div>
            <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Inter', sans-serif" }}>Flat Barbell Bench</span>
            <span className="text-[11px] ml-2" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}>P0 lock · every session</span>
          </div>
        </div>
        <div className="grid mb-1" style={{ gridTemplateColumns: "90px repeat(4, 1fr)" }}>
          <span className="text-[9px] tracking-[0.1em] uppercase" style={{ color: "#555", fontFamily: "'Inter', sans-serif" }}>Exercise</span>
          {[1,2,3,4].map(w => (
            <span key={w} className="text-[9px] tracking-[0.1em] uppercase text-center" style={{ color: w === 4 ? phaseColor : "#555", fontFamily: "'Inter', sans-serif" }}>W{w}{w === 4 ? " ●" : ""}</span>
          ))}
        </div>
        {rotationData.map((slot, si) => (
          <div key={si} className="grid py-1.5" style={{ gridTemplateColumns: "90px repeat(4, 1fr)", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
            <span className="text-[10px] flex items-center truncate" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}>{slot.name}</span>
            {slot.weeks.map((on, wi) => (
              <span key={wi} className="text-[10px] text-center" style={{ color: on ? "#F5F5F5" : "rgba(255,255,255,0.12)", fontWeight: on ? 500 : 400, fontFamily: "'Inter', sans-serif" }}>{on ? "✓" : "—"}</span>
            ))}
          </div>
        ))}
        <div className="flex justify-between mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
          <span className="text-[10px]" style={{ color: "#555", fontFamily: "'Inter', sans-serif" }}>4 sessions logged</span>
          <span className="text-[10px]" style={{ color: phaseColor, fontFamily: "'Inter', sans-serif" }}>12 unique exercises</span>
        </div>
      </div>
    </div>
  );
}

function DebriefMockup() {
  return (
    <div className="rounded-2xl overflow-hidden aspect-square flex flex-col" style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-5 pt-5 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1a1a1a,#0a0a0a)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Playfair Display', serif" }}>C</span>
            </div>
            <div>
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Inter', sans-serif" }}>Carmona</span>
              <span className="block text-[9px]" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Inter', sans-serif" }}>Post-Session Debrief</span>
            </div>
          </div>
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Inter', sans-serif" }}>Push</span>
        </div>
      </div>
      <div className="flex-1 px-5 py-4 overflow-hidden">
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}>
          The incline work is landing where it needs to — 75s for 8 means the upper shelf is building properly. That's the line from flat to standout. Cable flyes are dialing in the inner tie-in, hold that weight one more week before we push. The volume density today was right for this phase of the ramp.
        </p>
        <div className="flex gap-2 mt-4">
          <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ background: "rgba(74,222,128,0.08)", color: "#4ADE80", fontFamily: "'Inter', sans-serif" }}>PR: Incline DB 75×8</span>
          <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif" }}>Hold: Cable Flye</span>
        </div>
      </div>
      <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="flex gap-2.5">
          {[
            { label: "Volume", value: "14.2K", unit: "lbs" },
            { label: "Sets", value: "22", unit: "completed" },
            { label: "Exercises", value: "6", unit: "logged" },
          ].map(st => (
            <div key={st.label} className="flex-1 text-center p-2.5 rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)" }}>
              <p className="text-base font-medium" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{st.value}</p>
              <p className="text-[8px] mt-1" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Inter', sans-serif" }}>{st.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



// ─── WAITLIST EMAIL CAPTURE ──────────────────────────────────────────────────

function WaitlistSection() {
  // Use hooks properly
  const [emailVal, setEmailVal] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailVal || submitStatus === "sending") return;
    setSubmitStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/mojkajpg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailVal }),
      });
      if (res.ok) {
        setSubmitStatus("success");
        setEmailVal("");
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <section id="waitlist" className="relative py-28 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn>
          <SectionLabel>Early Access</SectionLabel>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-[1.05]" style={{ fontFamily: font.display, color: B.accent }}>
            Lock your founding rate.
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-base mb-10 leading-relaxed max-w-lg mx-auto" style={{ fontFamily: font.body, color: B.muted }}>
            $19.99/mo — permanently locked for founding members. Drop your email and we'll notify you the moment the doors open.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          {submitStatus === "success" ? (
            <div className="py-6">
              <p className="text-lg font-medium" style={{ fontFamily: font.body, color: B.accent }}>You're on the list. ✓</p>
              <p className="text-sm mt-2" style={{ fontFamily: font.body, color: B.muted }}>We'll be in touch when it's time to start.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="you@company.com" style={{ fontSize: "16px" }}
                value={emailVal}
                onChange={(e) => setEmailVal(e.target.value)}
                className="flex-1 px-5 py-4 rounded-full text-sm outline-none transition-all duration-300 focus:ring-2"
                style={{
                  fontFamily: font.body,
                  background: B.glass,
                  border: `1px solid ${B.glassBorder}`,
                  color: B.accent,
                  ringColor: B.glassBorder,
                }}
              />
              <button
                type="submit"
                disabled={submitStatus === "sending"}
                className="px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{ fontFamily: font.body, background: B.accent, color: B.bg }}
              >
                {submitStatus === "sending" ? "Joining..." : "Reserve My Spot →"}
              </button>
            </form>
          )}
          {submitStatus === "error" && (
            <p className="text-sm mt-3" style={{ color: "#ef4444", fontFamily: font.body }}>Something went wrong. Try again.</p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

// ─── FAQ SECTION ─────────────────────────────────────────────────────────────

function FAQSection() {
  const faqs = [
    { q: "Can I cancel anytime?", a: "Yes. No contracts, no commitments. Cancel from your account settings in one tap." },
    { q: "What equipment do I need?", a: "Access to a standard commercial gym — barbells, dumbbells, cables, and machines. No specialty equipment required." },
    { q: "Is this for beginners?", a: "Carmona OS is built for intermediate to advanced lifters who train consistently and want a structured system. If you already train 3–5 days a week, this is for you." },
    { q: "How is this different from a $10 fitness app?", a: "Most apps give you random workouts. Carmona OS runs a real progression engine — it tracks your performance, rotates exercises intelligently, and tells you exactly when to add load. Plus you get a personalized AI debrief after every session." },
    { q: "What happens after I sign up?", a: "You'll calibrate your profile (goal, experience, training days), and the system generates your first session immediately. No setup delay — you can train the same day." },
  ];
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="relative py-28 px-6">
      <SectionDivider />
      <div className="max-w-2xl mx-auto">
        <FadeIn><SectionLabel>FAQ</SectionLabel></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 leading-[1.1]" style={{ fontFamily: font.display, color: B.accent }}>
            Common questions.
          </h2>
        </FadeIn>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={0.1 + i * 0.05}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left p-5 rounded-2xl transition-all duration-300"
                style={{ background: openIdx === i ? B.glass : "transparent", border: `1px solid ${B.glassBorder}` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium pr-4" style={{ fontFamily: font.body, color: B.accent }}>{faq.q}</span>
                  <span className="text-lg flex-shrink-0 transition-transform duration-300" style={{ color: B.muted, transform: openIdx === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
                </div>
                {openIdx === i && (
                  <p className="text-sm mt-3 leading-relaxed" style={{ fontFamily: font.body, color: B.muted }}>{faq.a}</p>
                )}
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t px-6 py-12" style={{ borderColor: B.glassBorder }}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: B.glassBorder, color: B.accent, fontFamily: font.display }}>C</div>
          <span className="text-xs" style={{ fontFamily: font.body, color: B.muted }}>© {new Date().getFullYear()} Carmona OS. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://www.instagram.com/carmonafitness" target="_blank" rel="noopener noreferrer" className="text-xs transition-colors hover:underline" style={{ fontFamily: font.body, color: B.muted }}>Instagram</a>
          <a href="mailto:support@carmonaos.com" className="text-xs transition-colors hover:underline" style={{ fontFamily: font.body, color: B.muted }}>Support</a>
          <span className="text-xs" style={{ fontFamily: font.body, color: B.muted }}>Privacy</span>
          <span className="text-xs" style={{ fontFamily: font.body, color: B.muted }}>Terms</span>
        </div>
      </div>
    </footer>
  );
}


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
                {f.label === "The Engine" ? <EngineMockup /> : f.label === "Before & Now" ? <BeforeNowMockup /> : <DebriefMockup />}
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
              <p className="text-xs mb-8" style={{ fontFamily: font.body, color: "rgba(255,255,255,0.3)" }}>3 sessions free · No credit card required · Founding member rate locks permanently</p>
              <div className="space-y-3 mb-8">
                {PRICING_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0"><path d="M20 6L9 17l-5-5" stroke={B.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="text-sm" style={{ fontFamily: font.body, color: B.muted }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" style={{ fontFamily: font.body, background: B.accent, color: B.bg }} onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}>
                Reserve Your Spot →
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
          <CTAButton onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}>Reserve Your Spot →</CTAButton>
        </FadeIn>
      </div>
    </section>
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
        body { background: #0A0A0A; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
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
        <TwoTracks />
        <FeaturesSection />

        <WaitlistSection />
        <FAQSection />
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
