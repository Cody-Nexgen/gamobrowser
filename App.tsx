import { useEffect, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import Onboarding from "./Onboarding";

const WINDOW_MODE_DELAY = 13900;

function DesktopBackdrop({ snapshot }: { snapshot: string }) {
  return (
    <img
      className="desktop-backdrop"
      src={snapshot}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}

function WindowControls() {
  return (
    <div className="window-chrome window-chrome--final">
      <div className="window-drag-region">
        <span className="chrome-mark" aria-hidden="true" />
        <span className="chrome-title">Gamo</span>
      </div>
      <div className="window-actions">
        <button
          aria-label="Minimize Gamo"
          onClick={() => window.gamoWindow?.minimize()}
        >
          <span className="minimize-icon" />
        </button>
        <button
          aria-label="Maximize Gamo"
          onClick={() => window.gamoWindow?.toggleMaximize()}
        >
          <span className="maximize-icon" />
        </button>
        <button
          className="close-button"
          aria-label="Close Gamo"
          onClick={() => window.gamoWindow?.close()}
        >
          <span className="close-icon" />
        </button>
      </div>
    </div>
  );
}

function GradientContent() {
  return (
    <>
      <MeshGradient
        width={1280}
        height={720}
        colors={["#0099ff", "#241d9a", "#f75092", "#9f50d3"]}
        distortion={0.8}
        swirl={0.1}
        grainMixer={0}
        grainOverlay={0}
        speed={1}
        style={{ width: "100%", height: "100%" }}
      />
      <div className="shader-light" />
    </>
  );
}

function ShaderSurface() {
  const [logoGeometry] = useState(() => {
    const viewportMinimum = Math.min(window.innerWidth, window.innerHeight);
    const size = Math.min(520, Math.max(360, viewportMinimum * 0.32));

    return {
      size,
      x: (window.innerWidth - size) / 2,
      y: (window.innerHeight - size) / 2
    };
  });

  return (
    <div className="shader-reveal" aria-hidden="true">
      <svg className="shader-expansion" width="100%" height="100%">
        <defs>
          <mask
            id="shader-expansion-mask"
            className="shader-expansion-mask"
            x="0"
            y="0"
            width="100%"
            height="100%"
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
          >
            <svg
              className="expansion-mark"
              x={logoGeometry.x}
              y={logoGeometry.y}
              width={logoGeometry.size}
              height={logoGeometry.size}
              viewBox="0 0 256 256"
              overflow="visible"
            >
              <circle
                className="expansion-stroke"
                cx="128"
                cy="128"
                r="88"
                fill="none"
                stroke="white"
                strokeWidth="38"
                strokeLinecap="round"
                strokeDasharray="462 92"
                transform="rotate(-42 128 128)"
              />
              <path
                className="expansion-stroke"
                d="M130 128H218V194"
                fill="none"
                stroke="white"
                strokeWidth="38"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </mask>
        </defs>
        <foreignObject
          className="shader-expansion-surface"
          x="0"
          y="0"
          width="100%"
          height="100%"
          mask="url(#shader-expansion-mask)"
        >
          <div className="shader-expansion-clip">
            <div className="shader-expansion-fill">
              <GradientContent />
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

function IntroSequence() {
  return (
    <section className="intro-sequence" aria-label="Gamo introduction">
      <div className="cinematic-scrim" aria-hidden="true" />

      <div className="opening-credit" aria-hidden="true">
        <strong className="credit-title">
          <span>Gamo</span>
          <em>&amp;</em>
          <span>Avan Kottapalli</span>
        </strong>
        <div className="credit-signoff">
          <i className="credit-flourish" />
          <small>Presents</small>
          <i className="credit-flourish credit-flourish--right" />
        </div>
      </div>

      <div className="logo-stage" aria-hidden="true">
        <div className="logo-glow">
          <div className="logo-glow-shape" />
        </div>
        <div className="white-logo">
          <div className="white-logo-fill" />
          <div className="logo-shimmer" />
        </div>
      </div>

      <ShaderSurface />

      <div className="gamo-word" aria-hidden="true">Gamo</div>
    </section>
  );
}

function LegacyFinalInterface() {
  return (
    <section className="final-interface" aria-label="Gamo workspace">
      <WindowControls />
      <div className="final-card-reveal">
        <article className="final-card" aria-label="Gamo session preview">
          <div className="card-topline">
            <span className="live-dot" />
            <span>FLOW SPACE</span>
            <span className="card-time">09:41</span>
          </div>
          <div className="session-mark" aria-hidden="true" />
          <h2>Your space is ready.</h2>
          <p>Everything is quiet. Begin when it feels right.</p>
          <div className="session-progress" aria-hidden="true">
            <span />
          </div>
          <div className="card-footer">
            <span>Deep focus</span>
            <span>Ambient · Aurora</span>
          </div>
        </article>
      </div>
    </section>
  );
}

function FinalInterface() {
  return (
    <section className="final-interface" aria-label="Gamo onboarding">
      <WindowControls />
      <Onboarding />
    </section>
  );
}

export default function App() {
  const onboardingPreview =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("onboarding");
  const [desktopSnapshot, setDesktopSnapshot] = useState("");
  const [isReady, setIsReady] = useState(onboardingPreview);

  useEffect(() => {
    if (onboardingPreview) return;
    let isMounted = true;

    const prepareOverlay = async () => {
      try {
        const [snapshot] = await Promise.all([
          window.gamoWindow?.getDesktopSnapshot(),
          document.fonts.load('500 74px "Cormorant Garamond"'),
          document.fonts.load('500 23px "Cormorant Garamond"'),
          document.fonts.ready
        ]);
        if (isMounted && snapshot) setDesktopSnapshot(snapshot);
      } finally {
        if (isMounted) setIsReady(true);
      }
    };

    prepareOverlay();
    return () => {
      isMounted = false;
    };
  }, [onboardingPreview]);

  useEffect(() => {
    if (onboardingPreview) return;
    // Not gated on desktopSnapshot: when screen capture is unavailable the snapshot
    // stays empty forever, and gating here left the app stuck in the fullscreen
    // transparent overlay, never becoming a real window.
    if (!isReady) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const timer = window.setTimeout(
      () => window.gamoWindow?.enterWindowMode(),
      prefersReducedMotion ? 80 : WINDOW_MODE_DELAY
    );

    return () => window.clearTimeout(timer);
  }, [desktopSnapshot, isReady, onboardingPreview]);

  // The backdrop is decoration. Requiring it here meant a machine that cannot
  // screen-capture showed a blank overlay instead of onboarding.
  if (!isReady) {
    return <div className="desktop-app desktop-app--waiting" />;
  }

  return (
    <div
      className={`desktop-app ${
        onboardingPreview ? "desktop-app--onboarding-preview" : ""
      }`}
    >
      {onboardingPreview ? (
        <div className="standalone-shader" aria-hidden="true">
          <GradientContent />
        </div>
      ) : (
        <>
          {desktopSnapshot ? <DesktopBackdrop snapshot={desktopSnapshot} /> : null}
          <IntroSequence />
        </>
      )}
      <FinalInterface />
    </div>
  );
}
