import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import chromeIcon from "./assets/browsers/chrome.svg";
import edgeIcon from "./assets/browsers/edge.svg";
import firefoxIcon from "./assets/browsers/firefox.svg";
import "./onboarding.css";

const TOTAL_STEPS = 6;
const TRANSITION_DURATION = 420;

type BrowserId = "chrome" | "edge" | "firefox";

type AccountState = {
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

type AccountMode = "create" | "login";

type AccountResult = {
  ok: boolean;
  account?: {
    id: string;
    email: string;
    createdAt: string;
  };
  error?: string;
  code?: string;
};

type ThemeOption = {
  id: string;
  label: string;
  color: string;
  secondary: string;
};

const themes: ThemeOption[] = [
  { id: "cloud", label: "Cloud", color: "#b8b0a8", secondary: "#e9e2dc" },
  { id: "emerald", label: "Emerald", color: "#21a66f", secondary: "#a5f3d0" },
  { id: "ocean", label: "Ocean", color: "#1e9df1", secondary: "#77d5ff" },
  { id: "violet", label: "Violet", color: "#7869e8", secondary: "#b8a7ff" },
  { id: "amber", label: "Amber", color: "#f29b17", secondary: "#ffd16d" },
  { id: "rose", label: "Rose", color: "#e64b76", secondary: "#ff9fbb" },
  { id: "coral", label: "Coral", color: "#f14d50", secondary: "#ffa19e" },
  { id: "ember", label: "Ember", color: "#f05b16", secondary: "#ffb270" }
];

const browserOptions: Array<{
  id: BrowserId;
  label: string;
  profileLabel: string;
  icon: string;
}> = [
  {
    id: "chrome",
    label: "Google Chrome",
    profileLabel: "2 profiles found",
    icon: chromeIcon
  },
  {
    id: "edge",
    label: "Microsoft Edge",
    profileLabel: "Profile found",
    icon: edgeIcon
  },
  {
    id: "firefox",
    label: "Mozilla Firefox",
    profileLabel: "Profile found",
    icon: firefoxIcon
  }
];

const finaleWords = [
  "Welcome",
  "to",
  "your",
  "new",
  "home",
  "on",
  "the",
  "internet"
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3.5 9h10M9.5 5l4 4-4 4" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M14.5 9h-10M8.5 5l-4 4 4 4" />
    </svg>
  );
}

function ButtonShortcut() {
  return (
    <span className="button-shortcut" aria-hidden="true">
      <kbd>Ctrl</kbd>
      <kbd>↵</kbd>
    </span>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.8 20 6v5.5c0 5.1-3.3 8.4-8 10-4.7-1.6-8-4.9-8-10V6l8-3.2Z" />
      <path d="m8.8 12 2 2 4.5-4.7" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.3 2.4 3.5 5.4 3.5 9S14.3 18.6 12 21M12 3c-2.3 2.4-3.5 5.4-3.5 9S9.7 18.6 12 21" />
    </svg>
  );
}

function GamepadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 8h8c2.9 0 5.1 2.6 4.6 5.5l-.7 4c-.3 1.7-2.4 2.3-3.6 1l-2-2.2H9.7l-2 2.2c-1.2 1.3-3.3.7-3.6-1l-.7-4C2.9 10.6 5.1 8 8 8Z" />
      <path d="M7 12v3M5.5 13.5h3M16.5 12.6h.1M18 14.5h.1" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9.5 14.5 5-5M7.3 16.7l-1 1a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0M16.7 7.3l1-1a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0" />
    </svg>
  );
}

function BrowserIcon({
  browser,
  className = ""
}: {
  browser: BrowserId;
  className?: string;
}) {
  const option = browserOptions.find(({ id }) => id === browser);

  return (
    <img
      className={`browser-brand-icon ${className}`.trim()}
      src={option?.icon}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}

function WelcomeGraphic() {
  return (
    <div className="product-graphic" aria-hidden="true">
      <div className="product-window">
        <div className="mini-window-bar">
          <span />
          <span />
          <span />
          <div className="mini-address">
            <ShieldIcon />
            <span>search privately with DuckDuckGo</span>
          </div>
        </div>
        <div className="product-tabs">
          <span className="active">Browser</span>
          <span>Store</span>
          <span>Library</span>
        </div>
        <div className="browser-scene">
          <div className="search-orbit">
            <span className="search-g">G</span>
            <div>
              <strong>Everything opens.</strong>
              <small>Protected by Gamo Proxy</small>
            </div>
          </div>
          <div className="route-line">
            <span>DuckDuckGo</span>
            <i />
            <span>Gamo relay</span>
            <i />
            <span>Any site</span>
          </div>
        </div>
        <div className="store-shelf">
          <div className="game-cover game-cover--one">
            <small>PLAY ANYWHERE</small>
            <strong>Driftline</strong>
          </div>
          <div className="game-cover game-cover--two">
            <small>YOUR LIBRARY</small>
            <strong>Afterlight</strong>
          </div>
          <div className="game-cover game-cover--three">
            <small>VIRTUALIZED</small>
            <strong>Northstar</strong>
          </div>
        </div>
      </div>
      <div className="graphic-float graphic-float--secure">
        <ShieldIcon />
        <span>
          <strong>Session intact</strong>
          <small>Logins · keys · redirects</small>
        </span>
      </div>
      <div className="graphic-float graphic-float--device">
        <span className="device-dot" />
        <span>
          <strong>Ready on this PC</strong>
          <small>Virtualization available</small>
        </span>
      </div>
    </div>
  );
}

function AccountGraphic() {
  return (
    <div className="account-graphic" aria-hidden="true">
      <div className="account-orbit account-orbit--outer" />
      <div className="account-orbit account-orbit--inner" />
      <div className="identity-core">
        <span className="identity-mark" />
        <small>GAMO ID</small>
        <strong>One account.</strong>
        <span>Browser + Store + Library</span>
      </div>
      <div className="identity-node identity-node--browser">
        <GlobeIcon />
        <span>Browser</span>
      </div>
      <div className="identity-node identity-node--store">
        <GamepadIcon />
        <span>Store</span>
      </div>
      <div className="identity-node identity-node--shield">
        <ShieldIcon />
        <span>Encrypted locally</span>
      </div>
      <div className="sync-pill">
        <span className="sync-pulse" />
        Account data ready to sync
      </div>
    </div>
  );
}

function ImportGraphic({ selected }: { selected: BrowserId }) {
  const browser = browserOptions.find(({ id }) => id === selected);

  return (
    <div className="import-graphic" aria-hidden="true">
      <div className="import-browser">
        <div className="import-tabs">
          <span />
          <span />
          <span />
          <BrowserIcon browser={selected} className="import-profile-icon" />
          <strong>{browser?.label ?? "Browser"} profile</strong>
        </div>
        <div className="bookmark-row">
          <span>Work</span>
          <span>Games</span>
          <span>Watch later</span>
        </div>
        <div className="import-list">
          <span><i />Passwords<strong>128</strong></span>
          <span><i />Bookmarks<strong>46</strong></span>
          <span><i />History<strong>30 days</strong></span>
        </div>
      </div>
      <div className="password-card">
        <span className="key-symbol">◇</span>
        <div>
          <small>Autofill password</small>
          <strong>••••••••••</strong>
        </div>
        <span className="import-check">✓</span>
      </div>
      <div className="transfer-path">
        <BrowserIcon browser={selected} className="transfer-source-icon" />
        <i />
        <span className="transfer-gamo">G</span>
      </div>
    </div>
  );
}

function ThemeGraphic({ theme }: { theme: ThemeOption }) {
  return (
    <div
      className="theme-graphic"
      style={
        {
          "--theme-accent": theme.color,
          "--theme-secondary": theme.secondary
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div className="theme-browser">
        <div className="theme-tabs">
          <span />
          <span />
          <span />
          <i />
        </div>
        <div className="theme-message">
          <small>Gamo</small>
          <p>Your browser, library, and look—together.</p>
        </div>
        <div className="theme-response">
          Theme changed to <strong>{theme.label}</strong>.
        </div>
        <div className="theme-composer">
          <span>Search or enter a URL</span>
          <i>↑</i>
        </div>
      </div>
      <div className="theme-glow" />
    </div>
  );
}

function DefaultGraphic({ choice }: { choice: string }) {
  return (
    <div className="default-graphic" aria-hidden="true">
      <div className="default-browser">
        <div className="default-topbar">
          <span className="default-mark" />
          <div>Search DuckDuckGo or type a URL</div>
        </div>
        <div className="default-hero">
          <span className="default-g">Gamo</span>
          <strong>Your internet. Unblocked.</strong>
          <small>Proxy routing is on</small>
        </div>
        <div className="default-actions">
          <span><GlobeIcon />Browse</span>
          <span><GamepadIcon />Play</span>
          <span><ShieldIcon />Protected</span>
        </div>
      </div>
      <div className="default-badge">
        <span className={choice === "not-yet" ? "" : "active"}>✓</span>
        <div>
          <strong>{choice === "not-yet" ? "Choice saved" : "Gamo is ready"}</strong>
          <small>{choice === "week" ? "Try it for one week" : choice === "not-yet" ? "You can change this later" : "Open links with Gamo"}</small>
        </div>
      </div>
    </div>
  );
}

function WorkspacePlaceholder({
  email,
  theme
}: {
  email: string;
  theme: ThemeOption;
}) {
  return (
    <main
      className="workspace-placeholder"
      style={
        {
          "--theme-accent": theme.color,
          "--theme-secondary": theme.secondary
        } as React.CSSProperties
      }
    >
      <aside className="placeholder-sidebar">
        <div className="placeholder-brand">
          <span />
          Gamo
        </div>
        <nav aria-label="Gamo placeholder navigation">
          <button className="active">Home</button>
          <button>Browser</button>
          <button>Store</button>
          <button>Library</button>
        </nav>
        <small>{email || "Gamo account"}</small>
      </aside>
      <section className="placeholder-content">
        <div className="placeholder-eyebrow">ONBOARDING COMPLETE</div>
        <h1>Your new home is ready.</h1>
        <p>This is the placeholder for the full Gamo browser and store experience.</p>
        <div className="placeholder-search">
          <GlobeIcon />
          <span>Search privately with DuckDuckGo</span>
          <kbd>Ctrl</kbd>
          <kbd>L</kbd>
        </div>
        <div className="placeholder-grid">
          <article>
            <span className="placeholder-card-icon"><ShieldIcon /></span>
            <small>PROXY</small>
            <strong>Protected browsing</strong>
            <p>Links, sessions, and redirects stay intact.</p>
          </article>
          <article>
            <span className="placeholder-card-icon"><GamepadIcon /></span>
            <small>LIBRARY</small>
            <strong>Play on this PC</strong>
            <p>Your licensed games will appear here.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

function Finale({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const timer = window.setTimeout(onComplete, reducedMotion ? 450 : 5900);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="finale-screen">
      <div className="finale-bloom" aria-hidden="true" />
      <p className="finale-copy" aria-label="Welcome to your new home on the internet">
        {finaleWords.map((word, index) => (
          <span
            className="finale-word"
            style={{ "--word-index": index } as React.CSSProperties}
            key={word}
          >
            {word}
          </span>
        ))}
      </p>
      <div className="finale-status">
        <span />
        Preparing Gamo
      </div>
    </div>
  );
}

export default function Onboarding() {
  const initialStep = useMemo(() => {
    if (!import.meta.env.DEV) return 0;
    const requested = Number(new URLSearchParams(window.location.search).get("step"));
    return Number.isFinite(requested)
      ? Math.min(TOTAL_STEPS - 1, Math.max(0, requested))
      : 0;
  }, []);
  const [step, setStep] = useState(initialStep);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [account, setAccount] = useState<AccountState>({
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false
  });
  const [accountResult, setAccountResult] = useState<AccountResult | null>(null);
  const [accountPending, setAccountPending] = useState(false);
  const [accountMode, setAccountMode] = useState<AccountMode>("create");
  const [selectedBrowser, setSelectedBrowser] = useState<BrowserId>("chrome");
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [themeId, setThemeId] = useState("ocean");
  const [defaultChoice, setDefaultChoice] = useState("default");
  const transitionTimer = useRef<number | null>(null);
  const defaultSettingsOpened = useRef(false);
  const selectedTheme =
    themes.find((theme) => theme.id === themeId) ?? themes[2];

  useEffect(
    () => () => {
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    },
    []
  );

  const moveTo = (nextStep: number) => {
    if (isLeaving || nextStep === step) return;
    setIsLeaving(true);
    transitionTimer.current = window.setTimeout(() => {
      setStep(Math.min(TOTAL_STEPS - 1, Math.max(0, nextStep)));
      setIsLeaving(false);
    }, TRANSITION_DURATION);
  };

  const submitAccount = async (event?: FormEvent) => {
    event?.preventDefault();
    if (accountPending) return;

    if (!account.email.trim()) {
      setAccountResult({ ok: false, error: "Enter your email address." });
      return;
    }
    if (account.password.length < 8) {
      setAccountResult({
        ok: false,
        error: "Use at least 8 characters for your password."
      });
      return;
    }
    if (
      accountMode === "create" &&
      account.password !== account.confirmPassword
    ) {
      setAccountResult({ ok: false, error: "Your passwords do not match." });
      return;
    }
    if (accountMode === "create" && !account.acceptedTerms) {
      setAccountResult({
        ok: false,
        error: "Accept the Terms of Use and Privacy Policy to continue."
      });
      return;
    }

    setAccountPending(true);
    setAccountResult(null);
    try {
      let result: AccountResult;
      const accountPayload = {
        email: account.email,
        password: account.password
      };
      if (accountMode === "login" && window.gamoWindow?.signIn) {
        result = await window.gamoWindow.signIn(accountPayload);
      } else if (accountMode === "create" && window.gamoWindow?.createAccount) {
        result = await window.gamoWindow.createAccount(accountPayload);
      } else if (import.meta.env.DEV) {
        result = {
          ok: true,
          account: {
            id: "preview-account",
            email: account.email.trim().toLowerCase(),
            createdAt: new Date().toISOString()
          }
        };
      } else {
        result = {
          ok: false,
          error: accountMode === "login"
            ? "The sign-in service is unavailable."
            : "The account service is unavailable."
        };
      }

      setAccountResult(result);
      if (result.ok) {
        window.setTimeout(() => moveTo(2), 520);
      }
    } catch {
      setAccountResult({
        ok: false,
        error: accountMode === "login"
          ? "Gamo could not sign you in. Please try again."
          : "Gamo could not create your account. Please try again."
      });
    } finally {
      setAccountPending(false);
    }
  };

  const changeAccountMode = (mode: AccountMode) => {
    if (accountPending || mode === accountMode) return;
    setAccountMode(mode);
    setAccountResult(null);
  };

  const requestDefaultBrowserSettings = async () => {
    if (defaultSettingsOpened.current) return;
    const result = await window.gamoWindow?.openDefaultBrowserSettings?.();
    if (result?.ok) {
      defaultSettingsOpened.current = true;
    } else if (result?.error) {
      console.error(result.error);
    }
  };

  const selectDefaultChoice = (choice: string) => {
    setDefaultChoice(choice);
    if (choice === "default") {
      void requestDefaultBrowserSettings();
    }
  };

  const importSelection = () => {
    if (importing) return;
    setImporting(true);
    window.setTimeout(() => {
      setImported(true);
      setImporting(false);
      window.setTimeout(() => moveTo(3), 420);
    }, 950);
  };

  const finishSetup = async () => {
    if (defaultChoice === "default") {
      await requestDefaultBrowserSettings();
    }
    void window.gamoWindow?.saveOnboardingPreferences?.({
      theme: themeId,
      defaultBrowserChoice: defaultChoice,
      importedBrowser: imported ? selectedBrowser : null,
      completed: false
    });
    moveTo(5);
  };

  const completeOnboarding = async () => {
    const preferences = {
      theme: themeId,
      defaultBrowserChoice: defaultChoice,
      importedBrowser: imported ? selectedBrowser : null,
      completed: true
    };

    if (window.gamoWindow?.completeOnboarding) {
      const result = await window.gamoWindow.completeOnboarding(preferences);
      if (!result.ok) {
        console.error(result.error ?? "Gamo could not finish onboarding.");
      }
      return;
    }

    await window.gamoWindow?.saveOnboardingPreferences?.(preferences);
    setIsComplete(true);
  };

  const handleShortcut = (event: KeyboardEvent) => {
    if (!event.ctrlKey || event.key !== "Enter") return;
    event.preventDefault();
    if (step === 0) moveTo(1);
    if (step === 1) void submitAccount();
    if (step === 2) importSelection();
    if (step === 3) moveTo(4);
    if (step === 4) void finishSetup();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  });

  if (isComplete) {
    return <WorkspacePlaceholder email={account.email} theme={selectedTheme} />;
  }

  return (
    <main
      className="onboarding-shell"
      style={
        {
          "--theme-accent": selectedTheme.color,
          "--theme-secondary": selectedTheme.secondary
        } as React.CSSProperties
      }
    >
      <section className="onboarding-card" aria-label={`Gamo onboarding step ${step + 1} of ${TOTAL_STEPS}`}>
        <div className="onboarding-progress" aria-hidden="true">
          <span style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
        </div>
        <div className="step-count">
          <span>0{step + 1}</span>
          <i />
          <span>0{TOTAL_STEPS}</span>
        </div>

        <div
          className={`onboarding-scene ${isLeaving ? "is-leaving" : ""}`}
          key={step}
        >
          {step === 0 && (
            <>
              <div className="onboarding-copy welcome-copy">
                <div className="screen-kicker">BROWSER · STORE · LIBRARY</div>
                <h1>Welcome to Gamo.</h1>
                <p className="screen-lede">
                  A gaming platform and proxy browser that keeps the open web
                  and your licensed game library within reach.
                </p>
                <div className="feature-list">
                  <div>
                    <GlobeIcon />
                    <p><strong>Browse without dead ends.</strong> DuckDuckGo is built in, while Gamo routes sites through its proxy.</p>
                  </div>
                  <div>
                    <LinkIcon />
                    <p><strong>Keep every journey intact.</strong> Logins, redirects, new tabs, temporary links, and keys continue working.</p>
                  </div>
                  <div>
                    <GamepadIcon />
                    <p><strong>Take your games anywhere.</strong> Buy licensed titles and use virtualization where your computer needs help.</p>
                  </div>
                </div>
                <small className="license-note">Only access sites and games you are authorized to use.</small>
              </div>
              <WelcomeGraphic />
            </>
          )}

          {step === 1 && (
            <>
              <form className="onboarding-copy account-copy" onSubmit={submitAccount}>
                <div className="screen-kicker">YOUR GAMO ID</div>
                <h1>
                  {accountMode === "create"
                    ? "Create an account."
                    : "Welcome back."}
                </h1>
                <p className="screen-lede">
                  {accountMode === "create"
                    ? "One secure identity for your browser, store purchases, and game library."
                    : "Sign in to reconnect your Gamo store and game library."}
                </p>
                <div
                  className="account-mode-switch"
                  role="group"
                  aria-label="Choose account action"
                >
                  <button
                    type="button"
                    className={accountMode === "create" ? "selected" : ""}
                    aria-pressed={accountMode === "create"}
                    onClick={() => changeAccountMode("create")}
                  >
                    Create account
                  </button>
                  <button
                    type="button"
                    className={accountMode === "login" ? "selected" : ""}
                    aria-pressed={accountMode === "login"}
                    onClick={() => changeAccountMode("login")}
                  >
                    Sign in
                  </button>
                </div>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={account.email}
                    onChange={(event) =>
                      setAccount({ ...account, email: event.target.value })
                    }
                    placeholder="you@email.com"
                  />
                </label>
                {accountMode === "create" ? (
                  <div className="password-row">
                    <label>
                      <span>Password</span>
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={account.password}
                        onChange={(event) =>
                          setAccount({ ...account, password: event.target.value })
                        }
                        placeholder="8+ characters"
                      />
                    </label>
                    <label>
                      <span>Confirm password</span>
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={account.confirmPassword}
                        onChange={(event) =>
                          setAccount({
                            ...account,
                            confirmPassword: event.target.value
                          })
                        }
                        placeholder="Repeat password"
                      />
                    </label>
                  </div>
                ) : (
                  <label>
                    <span>Password</span>
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={account.password}
                      onChange={(event) =>
                        setAccount({ ...account, password: event.target.value })
                      }
                      placeholder="Your password"
                    />
                  </label>
                )}
                {accountMode === "create" && (
                  <label className="terms-check">
                    <input
                      type="checkbox"
                      checked={account.acceptedTerms}
                      onChange={(event) =>
                        setAccount({
                          ...account,
                          acceptedTerms: event.target.checked
                        })
                      }
                    />
                    <span className="custom-check" />
                    <span>I accept Gamo&apos;s Terms of Use and Privacy Policy.</span>
                  </label>
                )}
                <div
                  className={`form-message ${accountResult?.ok ? "success" : ""}`}
                  role="status"
                  aria-live="polite"
                >
                  {accountPending
                    ? accountMode === "login"
                      ? "Signing you in…"
                      : "Creating your encrypted account…"
                    : accountResult?.ok
                      ? accountMode === "login"
                        ? "Signed in. Welcome back."
                        : "Account created. Welcome to Gamo."
                      : accountResult?.error ?? ""}
                </div>
              </form>
              <AccountGraphic />
            </>
          )}

          {step === 2 && (
            <>
              <div className="onboarding-copy import-copy">
                <div className="screen-kicker">BRING YOUR BROWSER</div>
                <h1>Import your essentials.</h1>
                <p className="screen-lede">
                  Bring your bookmarks, history, and saved passwords with you.
                  Nothing is uploaded during import.
                </p>
                <div className="browser-options" role="radiogroup" aria-label="Browser to import">
                  {browserOptions.map(({ id, label, profileLabel }) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedBrowser === id}
                      className={selectedBrowser === id ? "selected" : ""}
                      onClick={() => setSelectedBrowser(id)}
                      key={id}
                    >
                      <span className={`browser-logo browser-logo--${id}`}>
                        <BrowserIcon browser={id} />
                      </span>
                      <span><strong>{label}</strong><small>{profileLabel}</small></span>
                      <i />
                    </button>
                  ))}
                </div>
                <div className={`import-status ${importing ? "active" : ""} ${imported ? "done" : ""}`}>
                  <span />
                  {imported ? "Import complete" : importing ? "Importing local browser data…" : "Ready to import"}
                </div>
              </div>
              <ImportGraphic selected={selectedBrowser} />
            </>
          )}

          {step === 3 && (
            <>
              <div className="onboarding-copy theme-copy">
                <div className="screen-kicker">MAKE IT YOURS</div>
                <h1>Add your flair.</h1>
                <p className="screen-lede">
                  Choose the accent that follows you from browsing to your game
                  library.
                </p>
                <div className="theme-swatches" role="radiogroup" aria-label="Choose a Gamo theme">
                  {themes.map((theme) => (
                    <button
                      type="button"
                      role="radio"
                      aria-label={theme.label}
                      aria-checked={themeId === theme.id}
                      className={themeId === theme.id ? "selected" : ""}
                      style={{ "--swatch": theme.color } as React.CSSProperties}
                      onClick={() => setThemeId(theme.id)}
                      key={theme.id}
                    >
                      <span />
                    </button>
                  ))}
                </div>
                <div className="theme-name">
                  <span style={{ background: selectedTheme.color }} />
                  {selectedTheme.label}
                </div>
              </div>
              <ThemeGraphic theme={selectedTheme} />
            </>
          )}

          {step === 4 && (
            <>
              <div className="onboarding-copy default-copy">
                <div className="screen-kicker">ONE CLICK AWAY</div>
                <h1>Give Gamo a shot?</h1>
                <p className="screen-lede">
                  Choose how Gamo should handle links after setup. You can
                  change this at any time.
                </p>
                <div className="default-options" role="radiogroup" aria-label="Default browser preference">
                  {[
                    ["default", "Yes, make Gamo my default", "Open web links in Gamo"],
                    ["week", "Try Gamo for a week", "Keep this preference temporary"],
                    ["not-yet", "Not yet", "Continue exploring first"]
                  ].map(([id, label, description]) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={defaultChoice === id}
                      className={defaultChoice === id ? "selected" : ""}
                      onClick={() => selectDefaultChoice(id)}
                      key={id}
                    >
                      <i />
                      <span><strong>{label}</strong><small>{description}</small></span>
                    </button>
                  ))}
                </div>
              </div>
              <DefaultGraphic choice={defaultChoice} />
            </>
          )}

          {step === 5 && <Finale onComplete={completeOnboarding} />}
        </div>

        {step < 5 && (
          <footer className="onboarding-actions">
            <div>
              {step > 0 && (
                <button
                  type="button"
                  className="quiet-button"
                  onClick={() => moveTo(step - 1)}
                  disabled={accountPending || importing}
                >
                  <BackIcon />
                  Back
                </button>
              )}
              {step === 2 && (
                <button
                  type="button"
                  className="skip-button"
                  onClick={() => moveTo(3)}
                  disabled={importing}
                >
                  Skip import
                </button>
              )}
              {step === 1 && (
                <button
                  type="button"
                  className="skip-button"
                  onClick={() => moveTo(2)}
                  disabled={accountPending}
                >
                  Skip account
                </button>
              )}
            </div>
            <div className="primary-action-group">
              {step === 0 && (
                <button
                  type="button"
                  className="primary-button"
                  aria-keyshortcuts="Control+Enter"
                  onClick={() => moveTo(1)}
                >
                  <span>Let&apos;s go</span>
                  <ButtonShortcut />
                  <ArrowIcon />
                </button>
              )}
              {step === 1 && (
                <button
                  type="button"
                  className="primary-button"
                  aria-keyshortcuts="Control+Enter"
                  onClick={() => void submitAccount()}
                  disabled={accountPending}
                >
                  <span>
                    {accountPending
                      ? accountMode === "login"
                        ? "Signing in…"
                        : "Creating…"
                      : accountMode === "login"
                        ? "Sign in"
                        : "Create account"}
                  </span>
                  <ButtonShortcut />
                  <ArrowIcon />
                </button>
              )}
              {step === 2 && (
                <button
                  type="button"
                  className="primary-button"
                  aria-keyshortcuts="Control+Enter"
                  onClick={importSelection}
                  disabled={importing}
                >
                  <span>{importing ? "Importing…" : "Import"}</span>
                  <ButtonShortcut />
                  <ArrowIcon />
                </button>
              )}
              {step === 3 && (
                <button
                  type="button"
                  className="primary-button"
                  aria-keyshortcuts="Control+Enter"
                  onClick={() => moveTo(4)}
                >
                  <span>Continue</span>
                  <ButtonShortcut />
                  <ArrowIcon />
                </button>
              )}
              {step === 4 && (
                <button
                  type="button"
                  className="primary-button"
                  aria-keyshortcuts="Control+Enter"
                  onClick={() => void finishSetup()}
                >
                  <span>Finish setup</span>
                  <ButtonShortcut />
                  <ArrowIcon />
                </button>
              )}
            </div>
          </footer>
        )}
      </section>
    </main>
  );
}
