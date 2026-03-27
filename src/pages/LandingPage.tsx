import './LandingPage.css';

const features = [
  {
    title: 'Flag Creation + Targeting',
    description: 'Boolean, string, number, or JSON flags with attribute-based targeting rules. First-match priority, regex, semver, and percentage splits.',
    icon: '🎯',
  },
  {
    title: 'Gradual Rollouts',
    description: 'Percentage-based rollouts with deterministic bucketing, sticky assignments, scheduled ramps, and automatic rollback triggers.',
    icon: '📈',
  },
  {
    title: 'A/B Testing + Stats',
    description: 'Built-in sample size calculator, sequential testing, confidence intervals, and automatic winner declaration. No stats PhD required.',
    icon: '🧪',
  },
  {
    title: 'Kill Switch',
    description: 'One-click emergency flag disable. Propagates globally in under 10 seconds. Bulk kill by tag. Full restore capability.',
    icon: '🛑',
  },
  {
    title: 'Flag Lifecycle',
    description: 'Track flags from draft to archived. Stale detection, deprecation workflows, cleanup reports, and ownership management.',
    icon: '♻️',
  },
  {
    title: 'Audit Log',
    description: 'Immutable record of every change. Before/after diffs, search and filter, CSV/JSON export, and webhook streaming.',
    icon: '📋',
  },
  {
    title: 'SDK Generator',
    description: 'Copy-paste integration code for JavaScript, Python, Go, Ruby, Java, and Rust. Framework-specific variants included.',
    icon: '⚡',
  },
];

const sdkSnippet = `import { FeatureGate } from '@featuregate/sdk';

const fg = new FeatureGate({ apiKey: 'fg_live_xxx' });

// Evaluate a flag
const showNewUI = fg.isEnabled('new-dashboard-ui', {
  userId: user.id,
  plan: user.plan,
});

// Track an experiment event
fg.track('purchase_completed', {
  userId: user.id,
  revenue: 49.99,
});`;

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Hero */}
      <header className="hero">
        <div className="hero-content">
          <h1>
            Feature flags that evaluate at the edge.
          </h1>
          <p className="hero-subtitle">
            Ship with confidence. FeatureGate gives you targeting rules, gradual rollouts,
            A/B testing with statistical rigor, and a kill switch for when things go wrong.
            All served from Cloudflare's edge for sub-millisecond evaluation.
          </p>
          <div className="hero-actions">
            <a href="#features" className="btn btn-primary">Explore Features</a>
            <a href="https://github.com/neenhouse/feature-gate" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="stats">
        <div className="stat">
          <span className="stat-value">&lt;5ms</span>
          <span className="stat-label">p99 Evaluation</span>
        </div>
        <div className="stat">
          <span className="stat-value">6</span>
          <span className="stat-label">SDK Languages</span>
        </div>
        <div className="stat">
          <span className="stat-value">&lt;10s</span>
          <span className="stat-label">Kill Switch Propagation</span>
        </div>
        <div className="stat">
          <span className="stat-value">300+</span>
          <span className="stat-label">Edge Locations</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <h2>Everything you need to ship safely</h2>
        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SDK Preview */}
      <section className="sdk-preview">
        <h2>Integrate in minutes</h2>
        <p className="section-subtitle">One SDK. Any language. Type-safe evaluation with zero config.</p>
        <div className="code-block">
          <div className="code-header">
            <span className="code-lang">TypeScript</span>
          </div>
          <pre><code>{sdkSnippet}</code></pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>FeatureGate — Open source feature flags and experimentation.</p>
          <div className="footer-links">
            <a href="https://github.com/neenhouse/feature-gate" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="/docs">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
