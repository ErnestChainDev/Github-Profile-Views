import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Github,
  Copy,
  RefreshCw,
  ExternalLink,
  Code2,
  BarChart3,
  Sparkles,
  Activity,
  User,
  ChevronDown,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import "../styles/ProfileViews.css";

const DEMO_BASE_URL = "https://github-profile-server-production.up.railway.app";
const DEMO_USERNAME = "ErnestChainDev";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

type CopyButtonProps = {
  text: string;
};

type ViewsResponse = {
  username: string;
  views: number;
  updatedAt: string;
  counted?: boolean;
};

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="pv-stat-card">
      <div className="pv-stat-card__inner">
        <div className="pv-stat-card__icon">
          <Icon size={20} />
        </div>

        <div>
          <p className="pv-stat-card__label">{label}</p>
          <p className="pv-stat-card__value">{value}</p>
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button onClick={onCopy} type="button" className="pv-copy-btn">
      <Copy size={16} />
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function ProfileViews() {
  const [username, setUsername] = useState(DEMO_USERNAME);
  const [views, setViews] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const endpoint = useMemo(
    () => `${DEMO_BASE_URL}/api/views/${username}`,
    [username]
  );

  const imageUrl = useMemo(
    () => `${DEMO_BASE_URL}/api/badge/${username}`,
    [username]
  );

  const markdown = useMemo(
    () => `![Profile Views](${imageUrl})`,
    [imageUrl]
  );

  const fetchViews = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(endpoint);

      if (!res.ok) {
        throw new Error("Failed to fetch profile views");
      }

      const data: ViewsResponse = await res.json();
      setViews(data.views ?? 0);
      setLastUpdated(data.updatedAt ?? new Date().toISOString());
    } catch {
      setError("Could not load live count. Connect this page to your backend/API.");
      setViews(1284);
      setLastUpdated(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViews();
  }, [endpoint]);

  return (
    <div className="pv-page">
      <header className="pv-navbar">
        <div className="pv-navbar__inner">
          <a href="/" className="pv-logo">
            <span className="pv-logo__mark">PV</span>
            <span className="pv-logo__text">PROFILEVIEWS</span>
          </a>

          <nav className="pv-navlinks">
            <a href="#overview" className="pv-navlink">
              OVERVIEW <ChevronDown size={14} />
            </a>
            <a href="#product" className="pv-navlink">
              HOW IT WORKS <ChevronDown size={14} />
            </a>
            <a href="#api" className="pv-navlink">
              API
            </a>
            <a href="#stats" className="pv-navlink">
              STATS
            </a>
            <a href="#resources" className="pv-navlink">
              DEPLOYMENT IDEAS <ChevronDown size={14} />
            </a>
          </nav>

          <div className="pv-navbar__actions">
            <button className="pv-btn pv-btn--primary" type="button" onClick={fetchViews}>
              TRY IT NOW
            </button>

            <button className="pv-profile-btn" type="button" aria-label="Profile">
              <User size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="pv-hero">
        <div className="pv-beta-badge">
          <Sparkles size={14} />
          NOW IN PUBLIC BETA
        </div>

        <h1 className="pv-title">
          Give Your GitHub Counter
          <span> Eyes and Hands.</span>
        </h1>

        <p className="pv-subtitle">
          STOP COUNTING. START TRACKING.
          <br />
          THE README VIEW COUNTER FOR YOUR GITHUB PROFILE.
        </p>

        <div className="pv-hero-actions">
          <button className="pv-btn pv-btn--primary pv-btn--hero" type="button" onClick={fetchViews}>
            START BUILDING <ArrowRight size={18} />
          </button>

          <a href="#product" className="pv-btn pv-btn--secondary pv-btn--hero">
            EXPLORE STATS
          </a>
        </div>
      </main>

      <section className="pv-dashboard" id="product">
        <div className="pv-dashboard__left">
          <div className="pv-panel">
            <div className="pv-panel__top">
              <div>
                <p className="pv-kicker">LIVE PREVIEW</p>
                <h2 className="pv-section-title">Counter Dashboard</h2>
              </div>

              <button className="pv-btn pv-btn--secondary" type="button" onClick={fetchViews}>
                <RefreshCw size={16} className={loading ? "pv-spin" : ""} />
                REFRESH
              </button>
            </div>

            <div className="pv-input-row">
              <div className="pv-input-wrap">
                <Github size={16} className="pv-input-icon" />
                <input
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.trim() || DEMO_USERNAME)
                  }
                  placeholder="GitHub username"
                  className="pv-input"
                />
              </div>
            </div>

            <div className="pv-stats-grid" id="stats">
              <StatCard icon={Eye} label="TOTAL VIEWS" value={views ?? "--"} />
              <StatCard
                icon={BarChart3}
                label="STATUS"
                value={loading ? "LOADING..." : "LIVE"}
              />
              <StatCard icon={Activity} label="USERNAME" value={username} />
            </div>

            <div className="pv-info-card">
              <div className="pv-info-box">
                <div className="pv-info-box__top">
                  <p className="pv-info-label">BADGE URL</p>
                  <CopyButton text={imageUrl} />
                </div>
                <p className="pv-code">{imageUrl}</p>
              </div>

              <div className="pv-info-box">
                <div className="pv-info-box__top">
                  <p className="pv-info-label">README MARKDOWN</p>
                  <CopyButton text={markdown} />
                </div>
                <p className="pv-code">{markdown}</p>
              </div>

              <div className="pv-preview-box">
                <p className="pv-info-label">SAMPLE BADGE PREVIEW</p>
                <div className="pv-preview-badge">
                  <Eye size={16} />
                  {username} • {views ?? 0} VIEWS
                </div>
              </div>

              <div className="pv-footer-info">
                <p className="pv-last-updated">
                  LAST UPDATED:{" "}
                  {lastUpdated ? new Date(lastUpdated).toLocaleString() : "—"}
                </p>

                {error ? <p className="pv-error">{error}</p> : null}
              </div>
            </div>
          </div>
        </div>

        <aside className="pv-dashboard__right">
          <div className="pv-side-card" id="overview">
            <div className="pv-side-card__head">
              <div className="pv-side-icon">
                <Code2 size={18} />
              </div>
              <h3 className="pv-side-title">HOW IT WORKS</h3>
            </div>

            <div className="pv-side-text">
              <p>1. YOUR README LOADS AN IMAGE FROM YOUR BADGE ENDPOINT.</p>
              <p>2. YOUR BACKEND TRACKS AND UPDATES THE VIEW COUNT.</p>
              <p>3. IT RETURNS AN SVG BADGE OR JSON RESPONSE.</p>
              <p>4. YOU CAN STORE DATA IN SQLITE, POSTGRESQL, OR REDIS.</p>
            </div>
          </div>

          <div className="pv-side-card" id="api">
            <div className="pv-side-card__head">
              <div className="pv-side-icon">
                <ExternalLink size={18} />
              </div>
              <h3 className="pv-side-title">API ROUTES</h3>
            </div>

            <div className="pv-route-list">
              <div className="pv-route-item">GET /api/views/:username</div>
              <div className="pv-route-item">GET /api/badge/:username</div>
              <div className="pv-route-item">GET /api/stats/top</div>
              <div className="pv-route-item">GET /api/profile/:username</div>
            </div>
          </div>

          <div className="pv-side-card pv-side-card--yellow" id="resources">
            <div className="pv-side-card__head">
              <div className="pv-side-icon pv-side-icon--white">
                <Github size={18} />
              </div>
              <h3 className="pv-side-title">DEPLOYMENT IDEAS</h3>
            </div>

            <div className="pv-side-text">
              <p>HOST FRONTEND ON VERCEL OR NETLIFY.</p>
              <p>HOST BACKEND ON RAILWAY, RENDER, OR CLOUDFLARE WORKERS.</p>
              <p>POINT YOUR README BADGE URL TO YOUR OWN DOMAIN.</p>
            </div>

            <a
              href={endpoint}
              target="_blank"
              rel="noreferrer"
              className="pv-btn pv-btn--secondary pv-side-link"
            >
              TEST API URL
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}