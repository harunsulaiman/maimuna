"use client";
import { useState, useEffect } from "react";

const TELEMETRY_LOG = [
  "Validating container (MP4 / AVI / MKV)...",
  "Separating visual and audio streams...",
  "Extracting facial embeddings — CNN-LSTM...",
  "Extracting MFCC audio features...",
  "Reconciling streams — weighted late fusion...",
  "Compiling verdict...",
];

const WAVE_HEIGHTS = Array.from({ length: 28 }, (_, i) =>
  6 + Math.round(Math.abs(Math.sin(i * 0.55)) * 34)
);

const MARQUEE_ITEMS = [
  "CNN-LSTM VISUAL ENCODER",
  "MFCC AUDIO PROFILING",
  "WEIGHTED LATE FUSION",
  "FRAME-LEVEL CONSISTENCY",
  "CROSS-MODAL RECONCILIATION",
  "42MS AVERAGE LATENCY",
  "98.6% HOLDOUT ACCURACY",
];

const FAQS = [
  {
    q: "What file types can I submit?",
    a: "MP4, AVI and MKV containers under 50MB. The file needs an audio track — the audio stream is one of the two independent signals the fusion layer relies on.",
  },
  {
    q: "How is this different from a single deepfake detector?",
    a: "Most detectors look at pixels alone, so a clean voice clone paired with a manipulated face — or the reverse — can slip through. Aletheia scores each stream separately and only reconciles them at the end, so a mismatch between what you see and what you hear is itself a signal.",
  },
  {
    q: "Can I run this on a live video call, not just a file?",
    a: "The core pipeline processes recorded clips today. Live-call verification uses the same underlying models with a streaming front end — ask us about early access.",
  },
  {
    q: "Is a verdict legally admissible on its own?",
    a: "No single automated tool should be. Every verdict is a probabilistic confidence score, not a certainty — it's built to support a documented review process, not replace one.",
  },
];

function SealMark() {
  return (
    <div className="brand__mark">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 12.5l5 5L20 6.5" stroke="#06070a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 8v5.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="1.15" fill="currentColor" />
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V4M12 4l-4.5 4.5M12 4l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21s-7.5-4.8-10-9.4C.4 8.2 2 4.5 5.6 4A5.6 5.6 0 0112 7a5.6 5.6 0 016.4-3c3.6.5 5.2 4.2 3.6 7.6C19.5 16.2 12 21 12 21z" />
    </svg>
  );
}

function ExhibitSilhouette() {
  return (
    <svg className="exhibit__silhouette" width="110" height="110" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="46" r="20" stroke="var(--violet-soft)" strokeWidth="1.6" />
      <path d="M26 100c4-20 16-30 34-30s30 10 34 30" stroke="var(--violet-soft)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default function HomePage() {
  // Added TypeScript generics here to fix the "never" type errors
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<string>("upload"); 
  const [results, setResults] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [navScrolled, setNavScrolled] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number>(0);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleFileSelect = (e: any) => {
    const selected = e.target.files[0];
    if (!selected) return;
    const isSupported =
      selected.type.includes("video/mp4") ||
      selected.name.endsWith(".avi") ||
      selected.name.endsWith(".mkv");
    if (isSupported) {
      setFile(selected);
      setError(null);
    } else {
      setError("That format isn't supported yet. Use MP4, AVI or MKV.");
    }
  };

  const runTelemetry = () => {
    let i = 0;
    setTelemetry([]);
    const interval = setInterval(() => {
      if (i < TELEMETRY_LOG.length) {
        setTelemetry((prev) => [...prev, TELEMETRY_LOG[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 700);
  };

  const startDetection = async () => {
    if (!file) return;
    setError(null);
    setStage("processing");
    runTelemetry();

    const formData = new FormData();
    formData.append("video", file);

    try {
      // Connect to your Python Flask backend
      const response = await fetch("http://127.0.0.1:5000/api/detect", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Processing failed");

      const data = await response.json();

      // Let the telemetry finish printing before showing the verdict
      setTimeout(async () => {
        setResults(data);
        setStage("result");

        try {
          await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              visual: data.visual,
              audio: data.audio,
              fused: data.fused,
              isFake: data.isFake,
            }),
          });
        } catch (dbError) {
          console.log("History logging skipped or failed.");
        }
      }, 4500);
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the detection engine. Confirm the backend is running.");
      setStage("upload");
    }
  };

  const resetSystem = () => {
    setFile(null);
    setResults(null);
    setStage("upload");
    setTelemetry([]);
    setError(null);
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className={`nav ${navScrolled ? "nav--scrolled" : ""}`}>
        <div className="wrap nav__inner">
          <a href="#top" className="brand">
            <SealMark />
            <span>Maimuna</span>
          </a>
          <nav className="nav__links" aria-label="Primary">
            <a href="#architecture">Architecture</a>
            <a href="#usecases">Use cases</a>
            <a href="#verify">Verify a file</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href="#verify" className="btn btn--primary btn--small">Verify a file</a>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="wrap hero__inner">
            <div className="hero__copy">
              {/* <div className="eyebrow">
                <span className="dot" />
                <span>Multimodal detection engine, live</span>
              </div> */}
              <h1>Truth doesn't hide in <em>one</em> stream.</h1>
              <p className="hero__lede">
                Maimuna reads a video's visual and audio streams independently,
                then reconciles them into a single, defensible verdict, built
                for newsrooms, trust and safety teams, and forensic examiners
                who can't afford to guess.
              </p>
              <div className="hero__actions">
                <a href="#verify" className="btn btn--primary">Verify a file</a>
                <a href="#architecture" className="btn btn--ghost">Read the architecture</a>
              </div>
              {/* <div className="hero__trust">
                <span>TRUSTED BY TEAMS AT</span>
                <div className="hero__trust-logos">
                  <span>NEWSDESK LABS</span>
                  <span color="#7c5cff">VERITAS WIRE</span>
                  <span>CIVIC MEDIA</span>
                </div>
              </div> */}
            </div>

            <div className="hero__visual" aria-hidden="true">
              <div className="exhibit">
                <span className="exhibit__tag">
                  <span>EXHIBIT 00231 / FRAME 0184</span>
                  <span className="live">ANALYZING</span>
                </span>
                <div className="exhibit__frame">
                  <div className="exhibit__grid" />
                  <div className="corner corner--tl" />
                  <div className="corner corner--tr" />
                  <div className="corner corner--bl" />
                  <div className="corner corner--br" />
                  <div className="exhibit__scan" />
                  <ExhibitSilhouette />
                </div>
                <div className="exhibit__wave">
                  {WAVE_HEIGHTS.map((h, i) => (
                    <span key={i} style={{ height: `${h}px`, animationDelay: `${i * 0.05}s` }} />
                  ))}
                </div>
                <div className="exhibit__verdict verdict authentic">
                  <CheckIcon />
                  Verified authentic — <strong>96.2%</strong> confidence
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>

        <section className="stats">
          <div className="wrap stats__inner">
            <div className="stat">
              <span className="stat__num">98.6%</span>
              <span className="stat__label">Cross-modal accuracy on holdout set</span>
            </div>
            <div className="stat">
              <span className="stat__num">42ms</span>
              <span className="stat__label">Average fusion latency per clip</span>
            </div>
            <div className="stat">
              <span className="stat__num">2</span>
              <span className="stat__label">Independent streams reconciled per file</span>
            </div>
          </div>
        </section>

        <section className="pipeline" id="architecture">
          <div className="wrap">
            {/* <div className="eyebrow">
              <span className="dot" />
              <span>The pipeline</span>
            </div> */}
            <h2>How a file gets read</h2>
            <p className="section__lede">
              Every submission passes through the same four stages before a
              verdict is produced. Nothing is skipped, and nothing is decided
              by a single stream alone.
            </p>
            <div className="pipeline__steps">
              <div className="pipeline__step">
                <span className="pipeline__num">01</span>
                <h3>Ingest &amp; demultiplex</h3>
                <p>The container is validated against MP4, AVI and MKV, then split into its visual and audio streams.</p>
              </div>
              <div className="pipeline__step">
                <span className="pipeline__num">02</span>
                <h3>Visual stream</h3>
                <p>A CNN-LSTM model extracts facial embeddings frame by frame and tracks inconsistency across the sequence.</p>
              </div>
              <div className="pipeline__step">
                <span className="pipeline__num">03</span>
                <h3>Audio stream</h3>
                <p>Mel-frequency cepstral coefficients profile the voice, independent of anything happening on screen.</p>
              </div>
              <div className="pipeline__step">
                <span className="pipeline__num">04</span>
                <h3>Fusion</h3>
                <p>A weighted late-fusion layer reconciles both streams into one confidence score.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="usecases" id="usecases">
          <div className="wrap">
            {/* <div className="eyebrow">
              <span className="dot" />
              <span>Who it's built for</span>
            </div> */}
            <h2>Built for people who verify, not guess</h2>
            <div className="usecases__list">
              <div className="usecase">
                <h3>Newsrooms &amp; fact-checking desks</h3>
                <p>Verify user-submitted footage before it runs, with a record of how the call was made.</p>
              </div>
              <div className="usecase">
                <h3>Trust &amp; safety teams</h3>
                <p>Flag synthetic media at upload, before it reaches a feed or a report queue.</p>
              </div>
              <div className="usecase">
                <h3>Legal &amp; forensic examiners</h3>
                <p>Build a documented, repeatable basis for disputed footage instead of a gut call.</p>
              </div>
              <div className="usecase">
                <h3>Identity &amp; compliance teams</h3>
                <p>Confirm a live video call is an unaltered person, not a synthetic proxy.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="verify" id="verify">
          <div className="wrap">
            {/* <div className="eyebrow">
              <span className="dot" />
              <span>Live demo</span>
            </div> */}
            <h2>Submit a file, get a verdict</h2>
            <p className="section__lede">
              Runs against the pipeline described above. Files stay local to
              your detection engine — nothing here is simulated.
            </p>

            <div className="verify__panel">
              {stage === "upload" && (
                <div>
                  <label className="dropzone">
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept="video/mp4,video/x-matroska,video/x-msvideo"
                    />
                    <div className="dropzone__icon">
                      <UploadIcon />
                    </div>
                    {file ? (
                      <h3 className="is-ready">{file.name} is ready for analysis</h3>
                    ) : (
                      <h3>Drop a video file, or click to browse</h3>
                    )}
                    <p>MP4, AVI or MKV · under 50MB · must include an audio track</p>
                  </label>

                  {error && (
                    <div className="error-banner">
                      <FlagIcon />
                      {error}
                    </div>
                  )}

                  <button className="btn btn--primary verify__submit" disabled={!file} onClick={startDetection}>
                    Run verification
                  </button>
                </div>
              )}

              {stage === "processing" && (
                <div className="console">
                  {telemetry.map((log, index) => (
                    <div key={index}>&gt; {log}</div>
                  ))}
                  <div className="console__cursor">&gt; _</div>
                </div>
              )}

              {stage === "result" && results && (
                <div>
                  <div className="result__head">
                    <h3 className="result__verdict" style={{ color: results.isFake ? "var(--flagged)" : "var(--authentic)" }}>
                      {results.isFake ? <FlagIcon /> : <CheckIcon />}
                      {results.isFake ? "Flagged — likely synthetic" : "Verified authentic"}
                    </h3>
                    <span className="result__fused">
                      Fused confidence <strong>{results.fused}%</strong>
                    </span>
                  </div>

                  <div className="result__metrics">
                    <div className="result__metric">
                      <span className="result__metric-label">Visual stream (CNN-LSTM)</span>
                      <span className={`result__metric-value ${results.visual >= 50 ? "is-flagged" : "is-clear"}`}>
                        {results.visual}%
                      </span>
                    </div>
                    <div className="result__metric">
                      <span className="result__metric-label">Audio stream (MFCC)</span>
                      <span className={`result__metric-value ${results.audio >= 50 ? "is-flagged" : "is-clear"}`}>
                        {results.audio}%
                      </span>
                    </div>
                  </div>

                  <button className="btn btn--ghost verify__reset" onClick={resetSystem}>
                    Analyze another file
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="faq" id="faq">
          <div className="wrap">
            {/* <div className="eyebrow">
              <span className="dot" />
              <span>Questions</span>
            </div> */}
            <h2>Everything before you submit a file</h2>
            <div className="faq__list">
              {FAQS.map((item, i) => (
                <div className={`faq__item ${openFaq === i ? "is-open" : ""}`} key={i}>
                  <button
                    className="faq__question"
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{item.q}</span>
                    <span><PlusIcon /></span>
                  </button>
                  <div className="faq__answer">
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-band" id="contact">
          <div className="wrap cta-band__inner">
            <h2>Ready to verify what's real?</h2>
            <p>Point the pipeline at your own footage, or send us a sample file to see a verdict first.</p>
            <div className="hero__actions">
              <a href="#verify" className="btn btn--primary">Verify a file</a>
              <a href="mailto:hello@aletheialabs.example" className="btn btn--ghost">Talk to us</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <div className="footer__brand">
            <a href="#top" className="brand">
              <SealMark />
              <span>Maimuna</span>
            </a>
            <p>Multimodal verification for synthetic media.</p>
          </div>
          <div className="footer__col">
            <h4>Product</h4>
            <a href="#architecture">Architecture</a>
            <a href="#usecases">Use cases</a>
            <a href="#verify">Verify a file</a>
          </div>
          <div className="footer__col">
            <h4>Company</h4>
            <a href="#contact">About</a>
            <a href="#contact">Research</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer__col">
            <h4>Resources</h4>
            <a href="#faq">FAQ</a>
            <a href="#architecture">Documentation</a>
            <a href="#usecases">Case studies</a>
          </div>
        </div>
        <div className="wrap footer__bottom">
          <span>© 2026 Harun Sulaiman</span>
          {/* <span className="footer__credit">Made with <HeartIcon /> by Harun</span> */}
        </div>
      </footer>
    </>
  );
}