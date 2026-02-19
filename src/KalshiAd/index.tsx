import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { loadFont } from "@remotion/google-fonts/Inter";

// ─── Font Setup ─────────────────────────────────────────────────────────────
const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "700", "800", "900"],
  subsets: ["latin"],
});

// ─── Design tokens ──────────────────────────────────────────────────────────
const TEAL = "#00D984";
const BLUE = "#4A7BF7";
const WHITE = "#FFFFFF";
const GRAY = "#B0B8C8";
const BG_DARK = "#07080F";
const BG_NAVY = "#0A0E27";

// ─── Particle data (deterministic, seeded from index) ───────────────────────
type Particle = {
  id: number;
  baseX: number;   // 0..1 normalized
  baseY: number;   // 0..1 normalized
  size: number;
  colorKind: "teal" | "white" | "blue";
  speedX: number;
  speedY: number;
  phase: number;
};

const PARTICLE_COUNT = 300;

function buildParticles(): Particle[] {
  const particles: Particle[] = [];
  // Use a simple LCG seeded by index for determinism
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const seed = i * 7919 + 13;
    const pseudo = (s: number) => ((s * 1664525 + 1013904223) & 0x7fffffff) / 0x7fffffff;
    const r0 = pseudo(seed);
    const r1 = pseudo(seed + 1);
    const r2 = pseudo(seed + 2);
    const r3 = pseudo(seed + 3);
    const r4 = pseudo(seed + 4);
    const r5 = pseudo(seed + 5);
    const r6 = pseudo(seed + 6);

    const colorRoll = r3;
    const colorKind: Particle["colorKind"] =
      colorRoll < 0.45 ? "teal" : colorRoll < 0.75 ? "white" : "blue";

    particles.push({
      id: i,
      baseX: r0,
      baseY: r1,
      size: 1.5 + r2 * 3,
      colorKind,
      speedX: (r4 - 0.5) * 0.002,
      speedY: (r5 - 0.5) * 0.002,
      phase: r6 * Math.PI * 2,
    });
  }
  return particles;
}

const PARTICLES = buildParticles();

// ─── Helper: opacity pulse ───────────────────────────────────────────────────
function particlePulse(frame: number, phase: number): number {
  return 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame * 0.08 + phase));
}

// ─── Sub-components ──────────────────────────────────────────────────────────

// Chaos particle layer — pure noise drift
const ChaosParticles: React.FC<{
  width: number;
  height: number;
  convergence?: number; // 0=chaos, 1=fully converged
  opacity?: number;
}> = ({ width, height, convergence = 0, opacity = 1 }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {PARTICLES.map((p) => {
          const noiseScale = 0.003;
          const timeScale = 0.012;

          // Base noise-driven position (chaos)
          const nx = noise2D(`px${p.id}`, p.baseX * 10 + frame * timeScale, 0);
          const ny = noise2D(`py${p.id}`, p.baseY * 10, frame * timeScale);

          // Wrap positions to keep particles on screen
          const rawX = p.baseX + nx * 0.25 + p.speedX * frame * 8;
          const rawY = p.baseY + ny * 0.25 + p.speedY * frame * 8;
          const chaosX = ((rawX % 1) + 1) % 1 * width;
          const chaosY = ((rawY % 1) + 1) % 1 * height;

          // Converged position — spiral toward center
          const angle = p.phase + frame * 0.02 * (1 - convergence * 0.5);
          const radius =
            (0.1 + (1 - convergence) * 0.3) *
            Math.min(width, height) *
            (0.3 + 0.7 * (p.id / PARTICLE_COUNT));
          const convX = width / 2 + Math.cos(angle + (p.id / PARTICLE_COUNT) * Math.PI * 2) * radius;
          const convY = height / 2 + Math.sin(angle + (p.id / PARTICLE_COUNT) * Math.PI * 2) * radius;

          // Interpolate between chaos and convergence
          const cx = chaosX + (convX - chaosX) * convergence;
          const cy = chaosY + (convY - chaosY) * convergence;

          const pulse = particlePulse(frame, p.phase);

          const color =
            p.colorKind === "teal"
              ? TEAL
              : p.colorKind === "blue"
              ? BLUE
              : WHITE;

          // Convergence brightens particles
          const particleOpacity = (0.4 + 0.6 * pulse) * (1 + convergence * 0.5);
          const glowRadius = p.size * (2.5 + convergence * 3);

          return (
            <g key={p.id}>
              {/* Soft glow halo */}
              <circle
                cx={cx}
                cy={cy}
                r={glowRadius}
                fill={color}
                opacity={particleOpacity * 0.2}
              />
              {/* Core dot */}
              <circle
                cx={cx}
                cy={cy}
                r={p.size * (1 + convergence * 0.5)}
                fill={color}
                opacity={Math.min(1, particleOpacity)}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Calm ambient particle layer for Scene 5 (ordered, flowing paths)
const AmbientParticles: React.FC<{ width: number; height: number; opacity: number }> = ({
  width,
  height,
  opacity,
}) => {
  const frame = useCurrentFrame();
  const AMBIENT_COUNT = 80;

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: AMBIENT_COUNT }, (_, i) => {
          const t = (i / AMBIENT_COUNT) * Math.PI * 2;
          const speed = 0.008 + (i % 5) * 0.003;
          const orbitR = 180 + (i % 6) * 90;
          const baseAngle = t + frame * speed;

          const x = width / 2 + Math.cos(baseAngle) * orbitR * (1 + 0.2 * Math.sin(baseAngle * 0.5));
          const y = height / 2 + Math.sin(baseAngle) * orbitR * 0.4 * (1 + 0.3 * Math.cos(baseAngle * 0.3));

          const colorKind = i % 3 === 0 ? TEAL : i % 3 === 1 ? WHITE : BLUE;
          const sz = 1 + (i % 4) * 0.7;
          const alpha = 0.2 + 0.3 * (0.5 + 0.5 * Math.sin(frame * 0.06 + t));

          return (
            <circle key={i} cx={x} cy={y} r={sz} fill={colorKind} opacity={alpha} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Radial backdrop gradient (SVG-based, no CSS background-image)
const RadialBackdrop: React.FC<{ width: number; height: number; opacity: number }> = ({
  width,
  height,
  opacity,
}) => {
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="radialBg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={BG_NAVY} stopOpacity={1} />
            <stop offset="100%" stopColor={BG_DARK} stopOpacity={1} />
          </radialGradient>
        </defs>
        <rect width={width} height={height} fill="url(#radialBg)" />
      </svg>
    </AbsoluteFill>
  );
};

// Event card component
type CardData = {
  question: string;
  pctStart: number;
  pctEnd: number;
  yesLabel: string;
  noLabel: string;
  yesFraction: number; // 0..1
};

const CARDS: CardData[] = [
  {
    question: "Will BTC hit $150K by end of year?",
    pctStart: 71,
    pctEnd: 78,
    yesLabel: "YES",
    noLabel: "NO",
    yesFraction: 0.74,
  },
  {
    question: "Will it snow in NYC this week?",
    pctStart: 34,
    pctEnd: 41,
    yesLabel: "YES",
    noLabel: "NO",
    yesFraction: 0.37,
  },
  {
    question: "Who wins the Super Bowl — Chiefs?",
    pctStart: 58,
    pctEnd: 63,
    yesLabel: "YES",
    noLabel: "NO",
    yesFraction: 0.61,
  },
];

const EventCard: React.FC<{
  card: CardData;
  index: number;
  width: number;
}> = ({ card, index, width }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animate the percentage counter
  const pct = Math.round(
    interpolate(frame, [0, 1.5 * fps], [card.pctStart, card.pctEnd], {
      extrapolateRight: "clamp",
    })
  );

  // Subtle bob
  const bob = Math.sin(frame * 0.04 + index * 1.2) * 6;

  const cardW = 480;
  const cardH = 200;

  // Card positions: center, left-offset, right-offset
  const offsets = [0, -520, 520];
  const cardX = width / 2 - cardW / 2 + offsets[index % 3];
  const cardY = 380 + bob;

  const yesBarW = Math.round(card.yesFraction * (cardW - 48));
  const noBarW = cardW - 48 - yesBarW;

  return (
    <div
      style={{
        position: "absolute",
        left: cardX,
        top: cardY,
        width: cardW,
        height: cardH,
        borderRadius: 20,
        background: "rgba(255,255,255,0.055)",
        border: `1.5px solid rgba(0,217,132,0.35)`,
        padding: "24px 24px 20px 24px",
        boxSizing: "border-box",
        boxShadow: `0 0 40px rgba(0,217,132,0.12), 0 4px 32px rgba(0,0,0,0.5)`,
        fontFamily,
      }}
    >
      {/* Teal top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 20,
          right: 20,
          height: 2,
          borderRadius: 1,
          background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)`,
        }}
      />

      {/* Question */}
      <div
        style={{
          color: WHITE,
          fontSize: 18,
          fontWeight: 600,
          lineHeight: 1.35,
          marginBottom: 16,
          letterSpacing: "-0.01em",
        }}
      >
        {card.question}
      </div>

      {/* Percentage display */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            color: TEAL,
            fontSize: 42,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {pct}%
        </span>
        <span style={{ color: GRAY, fontSize: 13, fontWeight: 500 }}>
          chance
        </span>
      </div>

      {/* YES / NO sentiment bars */}
      <div style={{ display: "flex", gap: 4 }}>
        <div
          style={{
            height: 6,
            width: yesBarW,
            borderRadius: 3,
            background: TEAL,
            opacity: 0.9,
          }}
        />
        <div
          style={{
            height: 6,
            width: noBarW,
            borderRadius: 3,
            background: "#F05252",
            opacity: 0.7,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 5,
        }}
      >
        <span style={{ color: TEAL, fontSize: 11, fontWeight: 600 }}>
          YES {Math.round(card.yesFraction * 100)}%
        </span>
        <span style={{ color: "#F05252", fontSize: 11, fontWeight: 600 }}>
          NO {Math.round((1 - card.yesFraction) * 100)}%
        </span>
      </div>
    </div>
  );
};

// Flash burst — used in The Snap scene
const FlashBurst: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flashOpacity = interpolate(
    frame,
    [0, 0.3 * fps, 0.8 * fps],
    [0, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const burstScale = interpolate(
    frame,
    [0, 0.4 * fps],
    [0.2, 3],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        opacity: flashOpacity,
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="flash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={WHITE} stopOpacity={1} />
            <stop offset="40%" stopColor={TEAL} stopOpacity={0.6} />
            <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse
          cx={width / 2}
          cy={height / 2}
          rx={(width * 0.5 * burstScale)}
          ry={(height * 0.5 * burstScale)}
          fill="url(#flash)"
        />
      </svg>
    </AbsoluteFill>
  );
};

// Teal glow halo behind the wordmark
const TealGlow: React.FC<{ width: number; height: number; opacity: number; pulse: number }> = ({
  width,
  height,
  opacity,
  pulse,
}) => {
  const glowOpacity = opacity * (0.55 + 0.45 * pulse);
  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: glowOpacity }}>
        <defs>
          <radialGradient id="tealGlow" cx="50%" cy="50%" r="35%">
            <stop offset="0%" stopColor={TEAL} stopOpacity={0.3} />
            <stop offset="60%" stopColor={TEAL} stopOpacity={0.08} />
            <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={width / 2} cy={height / 2} rx={width * 0.45} ry={height * 0.28} fill="url(#tealGlow)" />
      </svg>
    </AbsoluteFill>
  );
};

// ─── Scene components ─────────────────────────────────────────────────────────

const SceneChaos: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in particles over first 0.5 seconds
  const particleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ChaosParticles width={width} height={height} convergence={0} opacity={particleOpacity} />
    </AbsoluteFill>
  );
};

const SceneConvergence: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Over 3 seconds, convergence goes 0→1
  const convergence = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 40, mass: 1.5 },
    durationInFrames: 3 * fps,
  });

  const backdropOpacity = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <RadialBackdrop width={width} height={height} opacity={backdropOpacity} />
      <ChaosParticles width={width} height={height} convergence={convergence} opacity={1} />
    </AbsoluteFill>
  );
};

const SceneQuestions: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cards stagger in: card 0 at 0s, card 1 at 2s, card 2 at 4s
  const cardDelays = [0, 2 * fps, 4 * fps];

  // Background continues with high convergence (orderly spiral)
  const bgConvergence = 0.95 + 0.05 * Math.sin(frame * 0.02);

  return (
    <AbsoluteFill>
      {/* Persistent navy backdrop */}
      <RadialBackdrop width={width} height={height} opacity={1} />

      {/* Particle streams behind cards */}
      <ChaosParticles width={width} height={height} convergence={bgConvergence} opacity={0.6} />

      {/* Cards */}
      {CARDS.map((card, i) => {
        const delay = cardDelays[i];
        const cardFrame = frame - delay;

        if (cardFrame < 0) return null;

        const enterSpring = spring({
          frame: cardFrame,
          fps,
          config: { damping: 20, stiffness: 100, mass: 0.8 },
        });

        const cardOpacity = interpolate(cardFrame, [0, 0.4 * fps], [0, 1], {
          extrapolateRight: "clamp",
        });

        const cardY = interpolate(enterSpring, [0, 1], [120, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              opacity: cardOpacity,
              transform: `translateY(${cardY}px)`,
            }}
          >
            <Sequence from={0} durationInFrames={99999} premountFor={fps}>
              <EventCard card={card} index={i} width={width} />
            </Sequence>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneSnap: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Everything compresses toward center then flash
  const compressProgress = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: (t) => t * t,
  });

  // Flash happens at 0.5s mark
  const flashFrame = frame - Math.round(0.5 * fps);

  // KALSHI wordmark springs out from flash
  const wordmarkDelay = Math.round(0.7 * fps);
  const wordmarkFrame = frame - wordmarkDelay;
  const wordmarkSpring = spring({
    frame: wordmarkFrame,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.6 },
  });

  const wordmarkScale = interpolate(wordmarkSpring, [0, 1], [0, 1]);
  const wordmarkOpacity = interpolate(wordmarkFrame, [0, 0.4 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const taglineDelay = Math.round(1.2 * fps);
  const taglineFrame = frame - taglineDelay;
  const taglineOpacity = interpolate(taglineFrame, [0, 0.6 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Particle compression: convergence goes to 1, opacity decreases
  const particleOpacity = interpolate(frame, [0, 0.6 * fps], [0.6, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Dark navy bg */}
      <AbsoluteFill style={{ background: BG_DARK }} />
      <RadialBackdrop width={width} height={height} opacity={1} />

      {/* Compressed particles rushing to center */}
      {particleOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${1 - compressProgress * 0.7})`,
            transformOrigin: "center",
          }}
        >
          <ChaosParticles
            width={width}
            height={height}
            convergence={1}
            opacity={particleOpacity}
          />
        </div>
      )}

      {/* Flash burst */}
      {flashFrame >= 0 && (
        <Sequence from={0} durationInFrames={Math.round(1 * fps)} premountFor={fps}>
          <FlashBurst width={width} height={height} />
        </Sequence>
      )}

      {/* KALSHI wordmark */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <div
          style={{
            opacity: wordmarkOpacity,
            transform: `scale(${wordmarkScale})`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 160,
              fontWeight: 900,
              color: WHITE,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              textTransform: "uppercase" as const,
            }}
          >
            KALSHI
          </div>
        </div>

        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${interpolate(taglineFrame, [0, 0.6 * fps], [20, 0], { extrapolateRight: "clamp" })}px)`,
            marginTop: 20,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 28,
              fontWeight: 400,
              color: GRAY,
              letterSpacing: "0.08em",
              textAlign: "center" as const,
            }}
          >
            Trade on what happens next.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneHold: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Teal glow pulses
  const glowPulse = 0.5 + 0.5 * Math.sin(frame * 0.06);

  // "kalshi.com" fades in after 1s
  const urlOpacity = interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const urlY = interpolate(frame, [1 * fps, 2 * fps], [15, 0], {
    extrapolateRight: "clamp",
  });

  // Ambient particle opacity fades in
  const ambientOpacity = interpolate(frame, [0, 1.5 * fps], [0, 0.35], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: BG_DARK }} />
      <RadialBackdrop width={width} height={height} opacity={1} />

      {/* Calm ambient particles — order from chaos */}
      <AmbientParticles width={width} height={height} opacity={ambientOpacity} />

      {/* Teal glow halo */}
      <TealGlow width={width} height={height} opacity={1} pulse={glowPulse} />

      {/* Wordmark + tagline */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 160,
            fontWeight: 900,
            color: WHITE,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            textTransform: "uppercase" as const,
            textAlign: "center" as const,
          }}
        >
          KALSHI
        </div>

        <div
          style={{
            fontFamily,
            fontSize: 28,
            fontWeight: 400,
            color: GRAY,
            letterSpacing: "0.08em",
            textAlign: "center" as const,
            marginTop: 20,
          }}
        >
          Trade on what happens next.
        </div>

        {/* kalshi.com CTA */}
        <div
          style={{
            opacity: urlOpacity,
            transform: `translateY(${urlY}px)`,
            marginTop: 52,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 20,
              fontWeight: 500,
              color: TEAL,
              letterSpacing: "0.14em",
              textAlign: "center" as const,
            }}
          >
            kalshi.com
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────

export type KalshiAdProps = Record<string, never>;

export const KalshiAd: React.FC<KalshiAdProps> = () => {
  const { fps, width, height } = useVideoConfig();

  // Scene timing in frames
  const s1Start = 0;
  const s1Dur = 3 * fps;       // 0–3s (90 frames)

  const s2Start = 3 * fps;     // 3s
  const s2Dur = 3 * fps;       // 3–6s (90 frames)

  const s3Start = 6 * fps;     // 6s
  const s3Dur = 7 * fps;       // 6–13s (210 frames)

  const s4Start = 13 * fps;    // 13s
  const s4Dur = 3 * fps;       // 13–16s (90 frames)

  const s5Start = 16 * fps;    // 16s
  const s5Dur = 4 * fps;       // 16–20s (120 frames)

  return (
    <AbsoluteFill style={{ background: BG_DARK, fontFamily }}>
      {/* Scene 1 — Chaos */}
      <Sequence from={s1Start} durationInFrames={s1Dur} premountFor={fps}>
        <SceneChaos width={width} height={height} />
      </Sequence>

      {/* Scene 2 — Convergence */}
      <Sequence from={s2Start} durationInFrames={s2Dur} premountFor={fps}>
        <SceneConvergence width={width} height={height} />
      </Sequence>

      {/* Scene 3 — The Questions */}
      <Sequence from={s3Start} durationInFrames={s3Dur} premountFor={fps}>
        <SceneQuestions width={width} height={height} />
      </Sequence>

      {/* Scene 4 — The Snap */}
      <Sequence from={s4Start} durationInFrames={s4Dur} premountFor={fps}>
        <SceneSnap width={width} height={height} />
      </Sequence>

      {/* Scene 5 — Hold + CTA */}
      <Sequence from={s5Start} durationInFrames={s5Dur} premountFor={fps}>
        <SceneHold width={width} height={height} />
      </Sequence>
    </AbsoluteFill>
  );
};
