import { useState, useCallback } from 'react';
import { useStore } from '../lib/store';
import { sdkTemplates, sdkLanguageOrder } from '../lib/sdk-templates';
import type { SdkLanguage } from '../lib/sdk-templates';
import '../components/ui/shared.css';
import './SDKPage.css';

export default function SDKPage() {
  const { flags } = useStore();
  const [selectedLang, setSelectedLang] = useState<SdkLanguage>('javascript');
  const [selectedFlagId, setSelectedFlagId] = useState(flags[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  const selectedFlag = flags.find((f) => f.id === selectedFlagId);
  const template = sdkTemplates[selectedLang];
  const generatedCode = selectedFlag
    ? template.code(selectedFlag.key, selectedFlag.type)
    : template.code('my-feature-flag', 'boolean');

  const handleCopy = useCallback(async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, []);

  return (
    <div className="sdk-page">
      <div className="page-header">
        <h1>SDK Code Generator</h1>
        <p>Generate integration code for your preferred language</p>
      </div>

      {/* Config row */}
      <div className="sdk-config">
        <div className="form-group">
          <label htmlFor="sdk-flag">Select Flag</label>
          <select
            id="sdk-flag"
            className="form-select"
            value={selectedFlagId}
            onChange={(e) => setSelectedFlagId(e.target.value)}
          >
            {flags.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.key}) -- {f.type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Language tabs */}
      <div className="sdk-languages">
        {sdkLanguageOrder.map((lang) => (
          <button
            key={lang}
            className={`sdk-lang-tab ${selectedLang === lang ? 'sdk-lang-tab--active' : ''}`}
            onClick={() => setSelectedLang(lang)}
          >
            {sdkTemplates[lang].label}
          </button>
        ))}
      </div>

      {/* Install command */}
      <div className="sdk-install-section">
        <div className="sdk-install-header">
          <h3>Installation</h3>
          <button
            className={`copy-btn ${copiedInstall ? 'copy-btn--copied' : ''}`}
            onClick={() => handleCopy(template.installCommand, setCopiedInstall)}
          >
            {copiedInstall ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="sdk-install-code">
          <code>$ {template.installCommand}</code>
        </div>
      </div>

      {/* Generated code */}
      <div className="dash-code-block">
        <div className="dash-code-header">
          <span className="sdk-code-lang">{template.label}</span>
          {selectedFlag && (
            <span className="sdk-flag-info">
              <code>{selectedFlag.key}</code>
              <span className={`badge badge--${selectedFlag.status}`} style={{ marginLeft: '8px' }}>
                {selectedFlag.type}
              </span>
            </span>
          )}
          <button
            className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
            onClick={() => handleCopy(generatedCode, setCopied)}
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <div className="dash-code-body">
          <pre><code>{generatedCode}</code></pre>
        </div>
      </div>

      {/* Quick reference */}
      <div className="sdk-reference">
        <h3>Quick Reference</h3>
        <div className="sdk-ref-grid">
          <div className="sdk-ref-card">
            <h4>Flag Evaluation</h4>
            <p>Evaluate a feature flag for a specific user context. Returns the flag value based on targeting rules and rollout percentage.</p>
          </div>
          <div className="sdk-ref-card">
            <h4>User Context</h4>
            <p>Pass user attributes (ID, plan, country, etc.) for targeting rule evaluation. Attributes are matched against your configured rules.</p>
          </div>
          <div className="sdk-ref-card">
            <h4>Event Tracking</h4>
            <p>Track conversion events for A/B experiments. Events are linked to the user's assigned variant for statistical analysis.</p>
          </div>
          <div className="sdk-ref-card">
            <h4>Default Values</h4>
            <p>Always provide a default value. If the SDK cannot reach the server or the flag is not found, the default is returned.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
