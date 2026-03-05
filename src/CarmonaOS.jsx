import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

// ─── BRAND SYSTEM ────────────────────────────────────────────────────────────

const B = {
  bg: "#0A0A0A",
  accent: "#E8E8E8",
  muted: "#6B6B6B",
  dim: "rgba(255,255,255,0.25)",
  glass: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  green: "#10B981",
  amber: "#F59E0B",
};

const font = {
  display: "'Playfair Display', serif",
  body: "'Inter', sans-serif",
};

// ─── IMAGES ──────────────────────────────────────────────────────────────────

const IMAGES = {
  hero: "/hero-cover.jpg",
  shoulders: "/untitled-16.jpg",
  legs: "/Matthew_Carmona_061223_0268_jpg.jpeg",
  back: "/Matthew_Carmona_020524_0285.jpg",
  aux: "/IMG_0840_png.jpeg",
  watch: "/photo-watch.jpeg",
  tank: "/Matthew_Carmona_051324_0188.jpg",
  profile: "/untitled-16.jpg",
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const PROTOCOL_90 = [
  { name: "Barbell Bench Press", sets: "4 × 8–10", rest: "3 min", time: "16 min" },
  { name: "Incline Dumbbell Press", sets: "3 × 10–12", rest: "2 min", time: "10 min" },
  { name: "Cable Flyes", sets: "3 × 12–15", rest: "90s", time: "8 min" },
  { name: "Weighted Dips", sets: "3 × 8–10", rest: "2 min", time: "10 min" },
  { name: "Overhead Tricep Extension", sets: "3 × 12–15", rest: "90s", time: "8 min" },
  { name: "Lateral Raises (Giant Set)", sets: "4 × 15", rest: "60s", time: "8 min" },
  { name: "Pec Deck Finisher", sets: "3 × 15–20", rest: "60s", time: "6 min" },
  { name: "Warmup + Mobility", sets: "—", rest: "—", time: "14 min" },
];

const PROTOCOL_45 = [
  { name: "Bench → Incline DB (Superset)", sets: "4×8 / 4×10", rest: "90s", time: "14 min" },
  { name: "Cable Fly → Dips (Superset)", sets: "3×12 / 3×10", rest: "90s", time: "10 min" },
  { name: "Lateral / Tri / Pec (Tri-Set)", sets: "3×12 each", rest: "60s", time: "9 min" },
  { name: "Compressed Warmup", sets: "—", rest: "—", time: "6 min" },
];

const VAULT_ITEMS = [
  { title: "The 3D Delt Architecture", tag: "SHOULDERS", duration: "10:47", img: IMAGES.shoulders },
  { title: "Quad Sweep Engineering", tag: "LEGS", duration: "14:02", img: IMAGES.legs },
  { title: "Scapular Retraction Mastery", tag: "BACK", duration: "08:21", img: IMAGES.back },
  { title: "The Anterior Chain", tag: "ABS & CORE", duration: "12:34", img: IMAGES.aux },
];

const PRICING_FEATURES = [
  "Unlimited access to Carmona OS",
  "The Corporate Efficiency Engine",
  "The Visual Vault — 4K cinematic tutorials",
  "Data-Driven Progress Tracking",
  "Periodization Intelligence",
  "Priority protocol updates",
];

const FAQ_DATA = [
  { q: "Is this for beginners?", a: "Carmona OS is designed for intermediate to advanced lifters who already have a training foundation. If you've been consistently lifting for 6+ months and want to optimize your approach, you'll get the most out of the system." },
  { q: "Do I need a full gym?", a: "Yes. The protocols are built around standard commercial gym equipment — barbells, dumbbells, cables, and machines. No home-gym workarounds." },
  { q: "How is this different from RP or other programs?", a: "Most programs give you a template and leave you to figure out the time constraint yourself. Carmona OS is built around the constraint from day one — the Efficiency Engine lets you toggle between full and compressed protocols without sacrificing training quality." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts, no cancellation fees, no friction. You can cancel from your account in two clicks." },
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
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Glass({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border backdrop-blur-md ${className}`}
      style={{ background: B.glass, borderColor: B.border }}
      {...props}
    >
      {children}
    </div>
  );
}

function Tag({ children }) {
  return (
    <span
      className="inline-block text-xs tracking-[0.3em] uppercase mb-6 px-4 py-1.5 rounded-full border font-medium"
      style={{ color: B.muted, borderColor: B.border, background: B.glass, fontFamily: font.body }}
    >
      {children}
    </span>
  );
}

function Divider() {
  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-px"
      style={{ background: `linear-gradient(90deg, transparent, ${B.border}, transparent)` }}
    />
  );
}

function CTAButton({ children, className = "", style = {}, ...props }) {
  return (
    <button
      className={`group relative px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${className}`}
      style={{ fontFamily: font.body, background: B.accent, color: B.bg, ...style }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "#fff", boxShadow: "0 0 40px rgba(255,255,255,0.15)" }}
      />
    </button>
  );
}

function GhostButton({ children, ...props }) {
  return (
    <button
      className="px-8 py-4 rounded-full text-sm font-medium tracking-wide border transition-all duration-300 hover:bg-white/5"
      style={{ fontFamily: font.body, color: B.muted, borderColor: B.border }}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4"
    >
      <div
        className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl transition-all duration-500"
        style={{
          background: scrolled ? "rgba(10,10,10,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          border: scrolled ? `1px solid ${B.border}` : "1px solid transparent",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: B.glass, border: `1px solid ${B.border}` }}
          >
            <span className="text-sm font-bold" style={{ fontFamily: font.display, color: B.accent }}>C</span>
          </div>
          <span className="text-sm font-medium hidden sm:inline" style={{ fontFamily: font.body, color: B.accent }}>
            Carmona OS
          </span>
        </div>
        <button
          className="px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] hidden sm:inline-block"
          style={{ fontFamily: font.body, background: B.accent, color: B.bg }}
        >
          Get Access
        </button>
      </div>
    </motion.nav>
  );
}

// ─── STICKY MOBILE CTA ──────────────────────────────────────────────────────

function StickyMobileCTA({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
        >
          <div className="px-4 pb-6 pt-3" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.98) 60%, transparent 100%)" }}>
            <button
              className="w-full py-4 rounded-full text-sm font-semibold tracking-wide active:scale-[0.97]"
              style={{ fontFamily: font.body, background: B.accent, color: B.bg, boxShadow: "0 -4px 30px rgba(0,0,0,0.5)" }}
            >
              Initialize Your OS — $19.99/mo
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img src={IMAGES.hero} alt="" className="w-full h-full object-cover" style={{ objectPosition: "50% 15%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,10,10,0.93) 0%, rgba(10,10,10,0.75) 35%, rgba(10,10,10,0.25) 65%, transparent 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.5) 30%, transparent 55%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(10,10,10,0.5) 100%)" }} />
      </div>
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-24 pt-48 sm:pt-56">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Tag>Carmona OS v3.1</Tag>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 max-w-3xl"
          style={{ fontFamily: font.display, color: B.accent }}
        >
          The Operating System
          <br />
          <span className="italic font-normal" style={{ color: B.muted }}>for the Ambitious Few.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base sm:text-lg max-w-xl mb-12 leading-relaxed"
          style={{ fontFamily: font.body, color: B.muted }}
        >
          Elite hypertrophy logic meets professional-grade efficiency. Built for
          those who refuse to choose between a world-class physique and a
          world-class career.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col sm:flex-row items-start gap-4"
        >
          <CTAButton>Initialize Your OS — $19.99/mo</CTAButton>
          <GhostButton>See How It Works ↓</GhostButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}
        >
          <div className="w-1 h-1.5 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── DUAL-AUDIENCE HOOK ──────────────────────────────────────────────────────

function AudienceHook() {
  const [active, setActive] = useState(0);
  const personas = [
    {
      label: "The Corporate Athlete",
      headline: "Your calendar is full.\nYour potential isn't.",
      body: "You run a team, hit quarterly targets, and still want to be the most impressive person at any table. Carmona OS was built for your 6 AM before the 8 AM — structured, efficient, zero wasted minutes.",
      stat: "Built for 50+ hour weeks",
    },
    {
      label: "The Aesthetic Seeker",
      headline: "Stop training hard.\nStart training right.",
      body: "You've put in the work but the mirror doesn't reflect the effort. Carmona OS replaces guesswork with precision — every exercise chosen for its biomechanical impact on the physique you're actually building.",
      stat: "Every rep earns its place",
    },
  ];

  return (
    <section className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <Tag>Who This Is For</Tag>
        </FadeIn>

        {/* Toggle */}
        <FadeIn delay={0.1}>
          <div className="flex gap-2 mb-12">
            {personas.map((p, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  fontFamily: font.body,
                  background: active === i ? "rgba(255,255,255,0.1)" : "transparent",
                  color: active === i ? B.accent : B.muted,
                  border: `1px solid ${active === i ? "rgba(255,255,255,0.15)" : B.border}`,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-[1.05] whitespace-pre-line"
              style={{ fontFamily: font.display, color: B.accent }}
            >
              {personas[active].headline.split("\n").map((line, i) =>
                i === 1 ? <span key={i} className="italic font-normal" style={{ color: B.muted }}><br />{line}</span> : <span key={i}>{line}</span>
              )}
            </h2>

            <p
              className="text-lg leading-relaxed mb-8 max-w-2xl"
              style={{ fontFamily: font.body, color: B.muted }}
            >
              {personas[active].body}
            </p>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: B.green }} />
              <span className="text-sm font-medium" style={{ fontFamily: font.body, color: B.accent }}>
                {personas[active].stat}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Divider />
    </section>
  );
}

// ─── BURN SECTION ────────────────────────────────────────────────────────────

function BurnSection() {
  const stats = [
    { value: "50+", label: "Hour weeks,\naccounted for" },
    { value: "45", label: "Min sessions,\nfull volume" },
    { value: "0", label: "Bro-science\nor filler" },
  ];

  return (
    <section className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn><Tag>Philosophy</Tag></FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-[1.05]" style={{ fontFamily: font.display, color: B.accent }}>
            Beyond the<br />
            <span className="italic font-normal" style={{ color: B.muted }}>Influencer PDF.</span>
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-16 items-start mt-12">
          <FadeIn delay={0.2}>
            <p className="text-lg leading-relaxed mb-8" style={{ fontFamily: font.body, color: B.muted }}>
              Most programs are built for people with infinite time. Carmona OS is
              built for the professional who treats their body like their most
              important commitment.
            </p>
            <p className="text-base leading-relaxed" style={{ fontFamily: font.body, color: B.dim }}>
              Every variable is optimized. Every rest period is calculated. Every
              exercise selection is justified by peer-reviewed biomechanics — not
              a 22-year-old's Instagram story.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {stats.map((s, i) => (
                <Glass key={i} className="p-5 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: font.display, color: B.accent }}>{s.value}</div>
                  <div className="text-xs tracking-wide whitespace-pre-line" style={{ fontFamily: font.body, color: B.muted }}>{s.label}</div>
                </Glass>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <Divider />
    </section>
  );
}

// ─── PROOF SECTION ───────────────────────────────────────────────────────────

function ProofSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="relative py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full group"
          >
            <Glass className="px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={IMAGES.profile}
                  alt="Matthew Carmona"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  style={{ border: "2px solid rgba(255,255,255,0.1)" }}
                />
                <div className="text-left">
                  <div className="text-sm font-medium" style={{ fontFamily: font.body, color: B.accent }}>
                    Matthew Carmona
                  </div>
                  <div className="text-xs" style={{ fontFamily: font.body, color: B.muted }}>
                    Founder, Carmona OS · NASM-CPT · Natural Athlete
                  </div>
                </div>
              </div>
              <motion.span
                animate={{ rotate: expanded ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg flex-shrink-0 ml-4"
                style={{ color: B.muted }}
              >
                +
              </motion.span>
            </Glass>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <Glass className="mt-2 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={IMAGES.tank}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ objectPosition: "50% 15%" }}
                      />
                    </div>
                    <div>
                      <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: font.body, color: B.muted }}>
                        Matthew Carmona works in tech and knows what it's like to
                        have a demanding schedule. He's lived it, from J.P. Morgan
                        to Meta, with Harvard and Stanford GSB in between.
                      </p>
                      <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: font.body, color: B.muted }}>
                        He built Carmona OS because every training program he tried
                        was designed for someone with a different schedule than his.
                        The good ones took two hours. The short ones cut corners.
                        None of them were built by someone who actually sits in the
                        meetings, flies the red-eyes, and still has to figure out
                        where the workout goes.
                      </p>
                      <p className="text-sm leading-relaxed" style={{ fontFamily: font.body, color: B.accent }}>
                        NASM-certified. Natural. And the physique to prove the system works.
                      </p>
                    </div>
                  </div>
                </Glass>
              </motion.div>
            )}
          </AnimatePresence>
        </FadeIn>
      </div>

      <Divider />
    </section>
  );
}

// ─── MID-PAGE CTA ────────────────────────────────────────────────────────────

function MidCTA() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-xl mx-auto text-center">
        <FadeIn>
          <CTAButton>Start Your Transformation — $19.99/mo</CTAButton>
          <p className="text-xs mt-4" style={{ fontFamily: font.body, color: B.dim }}>Cancel anytime. No contracts.</p>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── EFFICIENCY ENGINE ───────────────────────────────────────────────────────

function EfficiencyEngine() {
  const [corp, setCorp] = useState(false);
  const protocol = corp ? PROTOCOL_45 : PROTOCOL_90;
  const total = corp ? "45 min" : "90 min";

  return (
    <section className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn><Tag>The Efficiency Engine</Tag></FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.05]" style={{ fontFamily: font.display, color: B.accent }}>
            One protocol.<br />
            <span className="italic font-normal" style={{ color: B.muted }}>Two time signatures.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-base max-w-xl mb-14 leading-relaxed" style={{ fontFamily: font.body, color: B.muted }}>
            Toggle between the full 90-minute Pro Protocol and the compressed
            45-minute Corporate Sprint. Same hypertrophy stimulus. Half the time.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Glass className="p-5 sm:p-8 md:p-10">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: corp ? B.amber : B.green }} />
                <span className="text-sm font-medium" style={{ fontFamily: font.body, color: B.accent }}>
                  {corp ? "Corporate Sprint" : "Pro Protocol"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full ml-2" style={{ fontFamily: font.body, color: B.muted, background: B.glass, border: `1px solid ${B.border}` }}>
                  {total}
                </span>
              </div>

              <button onClick={() => setCorp(!corp)} className="relative flex items-center gap-3 cursor-pointer" aria-label="Toggle">
                <span className="text-xs font-medium" style={{ fontFamily: font.body, color: !corp ? B.accent : B.muted }}>90 min</span>
                <div className="relative w-14 h-7 rounded-full transition-all duration-500" style={{ background: corp ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)", border: `1px solid ${corp ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}` }}>
                  <motion.div
                    className="absolute top-0.5 w-6 h-6 rounded-full"
                    animate={{ left: corp ? "calc(100% - 26px)" : "2px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{ background: corp ? B.amber : B.green, boxShadow: `0 0 12px ${corp ? "rgba(245,158,11,0.4)" : "rgba(16,185,129,0.4)"}` }}
                  />
                </div>
                <span className="text-xs font-medium" style={{ fontFamily: font.body, color: corp ? B.accent : B.muted }}>45 min</span>
              </button>
            </div>

            <div className="grid grid-cols-12 gap-2 pb-3 mb-2 text-xs tracking-wide uppercase border-b" style={{ fontFamily: font.body, color: B.muted, borderColor: B.border }}>
              <div className="col-span-5 sm:col-span-6">Exercise</div>
              <div className="col-span-3">Sets × Reps</div>
              <div className="col-span-2 hidden sm:block">Rest</div>
              <div className="col-span-4 sm:col-span-1 text-right">Time</div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={corp ? "c" : "p"}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {protocol.map((row, i) => (
                  <motion.div
                    key={row.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="grid grid-cols-12 gap-2 py-3 border-b items-center"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  >
                    <div className="col-span-5 sm:col-span-6 text-sm font-medium" style={{ fontFamily: font.body, color: B.accent }}>{row.name}</div>
                    <div className="col-span-3 text-sm" style={{ fontFamily: font.body, color: B.muted }}>{row.sets}</div>
                    <div className="col-span-2 hidden sm:block text-sm" style={{ fontFamily: font.body, color: B.muted }}>{row.rest}</div>
                    <div className="col-span-4 sm:col-span-1 text-sm text-right tabular-nums" style={{ fontFamily: font.body, color: B.muted }}>{row.time}</div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: `1px solid ${B.border}` }}>
              <span className="text-xs" style={{ fontFamily: font.body, color: B.muted }}>
                {corp ? "Supersets & tri-sets compress volume without sacrificing stimulus." : "Full rest periods for maximum mechanical tension."}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ fontFamily: font.body, color: corp ? B.amber : B.green, background: corp ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)" }}>
                Total: {total}
              </span>
            </div>
          </Glass>
        </FadeIn>
      </div>

      <Divider />
    </section>
  );
}

// ─── VISUAL VAULT ────────────────────────────────────────────────────────────

function VisualVault() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn><Tag>The Visual Vault</Tag></FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.05]" style={{ fontFamily: font.display, color: B.accent }}>
            Cinematic precision<br />
            <span className="italic font-normal" style={{ color: B.muted }}>for every rep.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="text-sm mb-12" style={{ fontFamily: font.body, color: B.muted }}>
            Shot on Sony ZV-E1. High-fidelity instruction for high-fidelity results.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VAULT_ITEMS.map((item, i) => (
            <FadeIn key={i} delay={0.1 + i * 0.08}>
              <Glass
                className="relative overflow-hidden cursor-pointer group"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={item.img}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.1) 50%, rgba(10,10,10,0.3) 100%)" }} />

                  {/* Cinematic bars */}
                  <div className="absolute top-0 left-0 right-0 h-[10%]" style={{ background: "rgba(0,0,0,0.5)" }} />
                  <div className="absolute bottom-0 left-0 right-0 h-[10%]" style={{ background: "rgba(0,0,0,0.5)" }} />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: hovered === i ? 1.1 : 1, opacity: hovered === i ? 1 : 0.6 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                    >
                      <svg width="16" height="18" viewBox="0 0 18 20" fill="none"><path d="M2 1.5L16 10L2 18.5V1.5Z" fill="white" fillOpacity="0.8" /></svg>
                    </motion.div>
                  </div>

                  <div className="absolute top-3 right-3 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded" style={{ fontFamily: font.body, color: B.accent, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>4K HDR</div>
                  <div className="absolute bottom-3 right-3 text-xs tabular-nums px-2 py-0.5 rounded" style={{ fontFamily: font.body, color: B.accent, background: "rgba(0,0,0,0.6)" }}>{item.duration}</div>
                </div>

                <div className="p-5">
                  <div className="text-[10px] tracking-[0.2em] uppercase mb-2 font-medium" style={{ fontFamily: font.body, color: B.muted }}>{item.tag}</div>
                  <div className="text-base font-medium" style={{ fontFamily: font.body, color: B.accent }}>{item.title}</div>
                </div>
              </Glass>
            </FadeIn>
          ))}
        </div>
      </div>

      <Divider />
    </section>
  );
}

// ─── PRICING ─────────────────────────────────────────────────────────────────

function Pricing() {
  return (
    <section className="relative py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn><Tag>Pricing</Tag></FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.05]" style={{ fontFamily: font.display, color: B.accent }}>
            One tier.<br />
            <span className="italic font-normal" style={{ color: B.muted }}>No compromises.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-base mb-14 leading-relaxed max-w-lg mx-auto" style={{ fontFamily: font.body, color: B.muted }}>
            We don't gatekeep features behind tiers. You get the full operating system or nothing. Simple.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Glass className="p-8 sm:p-12 max-w-lg mx-auto text-left">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl sm:text-6xl font-bold" style={{ fontFamily: font.display, color: B.accent }}>$19.99</span>
              <span className="text-base" style={{ fontFamily: font.body, color: B.muted }}>/mo</span>
            </div>
            <p className="text-xs mb-10" style={{ fontFamily: font.body, color: B.dim }}>Cancel anytime. No contracts. No friction.</p>

            <div className="space-y-4 mb-10">
              {PRICING_FEATURES.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: B.green }} />
                  <span className="text-sm" style={{ fontFamily: font.body, color: B.accent }}>{f}</span>
                </div>
              ))}
            </div>

            <CTAButton className="w-full" style={{ borderRadius: "9999px" }}>Initialize Your OS →</CTAButton>
          </Glass>
        </FadeIn>
      </div>

      <Divider />
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="relative py-28 px-6">
      <div className="max-w-2xl mx-auto">
        <FadeIn><Tag>FAQ</Tag></FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 leading-[1.1]" style={{ fontFamily: font.display, color: B.accent }}>
            Common questions.
          </h2>
        </FadeIn>

        <div className="space-y-2">
          {FAQ_DATA.map((item, i) => (
            <FadeIn key={i} delay={0.1 + i * 0.05}>
              <Glass className="overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-medium pr-4" style={{ fontFamily: font.body, color: B.accent }}>{item.q}</span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg flex-shrink-0"
                    style={{ color: B.muted }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed" style={{ fontFamily: font.body, color: B.muted }}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Glass>
            </FadeIn>
          ))}
        </div>
      </div>

      <Divider />
    </section>
  );
}

// ─── FINAL CTA ───────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ background: "radial-gradient(circle at 50% 50%, #ffffff 0%, transparent 60%)" }} />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-[1.05]" style={{ fontFamily: font.display, color: B.accent }}>
            Your physique is a system.<br />
            <span className="italic font-normal" style={{ color: B.muted }}>Give it an operating system.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-base mb-10 leading-relaxed max-w-md mx-auto" style={{ fontFamily: font.body, color: B.muted }}>
            Join the professionals who stopped guessing and started engineering their results.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <CTAButton>Initialize Your OS — $19.99/mo</CTAButton>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-14 px-6" style={{ borderTop: `1px solid ${B.border}` }}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: B.glass, border: `1px solid ${B.border}` }}>
            <span className="text-xs font-bold" style={{ fontFamily: font.display, color: B.accent }}>C</span>
          </div>
          <span className="text-sm font-medium" style={{ fontFamily: font.body, color: B.muted }}>Carmona OS</span>
        </div>
        <div className="flex items-center gap-8">
          {["Terms", "Privacy", "Support"].map((l) => (
            <a key={l} href="#" className="text-xs hover:text-white/80 transition-colors" style={{ fontFamily: font.body, color: B.muted }}>{l}</a>
          ))}
        </div>
        <span className="text-xs" style={{ fontFamily: font.body, color: B.dim }}>© 2025 Carmona OS. All rights reserved.</span>
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
        <AudienceHook />
        <BurnSection />
        <ProofSection />
        <MidCTA />
        <EfficiencyEngine />
        <VisualVault />
        <Pricing />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
