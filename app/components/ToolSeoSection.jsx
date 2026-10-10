import React from 'react';
import { ShieldCheck, Zap, Lock, ChevronDown, CheckCircle2, Check, X } from 'lucide-react';

export default function ToolSeoSection({
  heading = 'Everything You Need to Know',
  subheading = 'Fast, secure, and processed 100% inside your browser.',
  features = [],
  steps = [],
  faqs = [],
  showComparison = true
}) {
  // Generate Schema.org FAQPage structured data
  const faqSchema = faqs && faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  } : null;

  return (
    <section className="seo-section-wrapper" aria-label="Tool Information and FAQs">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Section Header */}
      <div className="seo-header-block">
        <span className="seo-section-badge">Privacy & Features</span>
        <h2 className="seo-section-title">{heading}</h2>
        <p className="seo-section-subtitle">{subheading}</p>
      </div>

      {/* 3 Core Guarantee Cards */}
      {features.length > 0 && (
        <div className="seo-features-grid">
          {features.map((feat, idx) => (
            <div key={idx} className="seo-feature-card">
              <div className="seo-feature-icon-box">
                {idx === 0 && <ShieldCheck size={20} />}
                {idx === 1 && <Zap size={20} />}
                {idx === 2 && <Lock size={20} />}
                {idx > 2 && <CheckCircle2 size={20} />}
              </div>
              <h3 className="seo-feature-title">{feat.title}</h3>
              <p className="seo-feature-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* "Why MintTools is the Best Choice" Comparison Table */}
      {showComparison && (
        <div className="seo-comparison-container">
          <div className="seo-comparison-header">
            <h3 className="seo-comparison-title">Why MintTools is the Best Choice</h3>
            <p className="seo-comparison-subtitle">
              See why thousands choose our 100% client-side privacy over traditional cloud paywalls.
            </p>
          </div>
          <div className="seo-comparison-table-wrapper">
            <table className="seo-comparison-table">
              <thead>
                <tr>
                  <th className="th-feature">Key Criteria</th>
                  <th className="th-mint">MintTools</th>
                  <th className="th-others">Traditional Cloud Tools</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Privacy & Security</strong>
                    <span className="td-desc">Where your documents are processed</span>
                  </td>
                  <td className="td-mint">
                    <div className="cell-flex">
                      <span className="badge-check"><Check size={14} /></span>
                      <span>100% In-Browser (Zero Server Uploads)</span>
                    </div>
                  </td>
                  <td className="td-others">
                    <div className="cell-flex">
                      <span className="badge-cross"><X size={14} /></span>
                      <span>Uploaded to 3rd-party remote servers</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Account & Signups</strong>
                    <span className="td-desc">Access friction and data collection</span>
                  </td>
                  <td className="td-mint">
                    <div className="cell-flex">
                      <span className="badge-check"><Check size={14} /></span>
                      <span>No Account, Email, or Signup Needed</span>
                    </div>
                  </td>
                  <td className="td-others">
                    <div className="cell-flex">
                      <span className="badge-cross"><X size={14} /></span>
                      <span>Forced registration & marketing emails</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Daily Usage Limits</strong>
                    <span className="td-desc">Number of files you can process</span>
                  </td>
                  <td className="td-mint">
                    <div className="cell-flex">
                      <span className="badge-check"><Check size={14} /></span>
                      <span>Unlimited Free Processing</span>
                    </div>
                  </td>
                  <td className="td-others">
                    <div className="cell-flex">
                      <span className="badge-cross"><X size={14} /></span>
                      <span>2–3 tasks per day, then paywalled</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Watermarks & Branding</strong>
                    <span className="td-desc">Integrity of your exported files</span>
                  </td>
                  <td className="td-mint">
                    <div className="cell-flex">
                      <span className="badge-check"><Check size={14} /></span>
                      <span>Zero Watermarks or Logos Added</span>
                    </div>
                  </td>
                  <td className="td-others">
                    <div className="cell-flex">
                      <span className="badge-cross"><X size={14} /></span>
                      <span>Often adds watermarks on free tiers</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Cost & Subscriptions</strong>
                    <span className="td-desc">Pricing transparency</span>
                  </td>
                  <td className="td-mint">
                    <div className="cell-flex">
                      <span className="badge-check"><Check size={14} /></span>
                      <span>100% Free Forever</span>
                    </div>
                  </td>
                  <td className="td-others">
                    <div className="cell-flex">
                      <span className="badge-cross"><X size={14} /></span>
                      <span>$10 – $25/month recurring subscriptions</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3-Step "How It Works" */}
      {steps.length > 0 && (
        <div className="seo-steps-container">
          <h3 className="seo-steps-title">How It Works in 3 Quick Steps</h3>
          <div className="seo-steps-grid">
            {steps.map((st, idx) => (
              <div key={idx} className="seo-step-item">
                <span className="seo-step-num">{idx + 1}</span>
                <div className="seo-step-text">
                  <strong>{st.title}</strong>
                  <span>{st.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs Accordions */}
      {faqs.length > 0 && (
        <div className="seo-faqs-container">
          <h3 className="seo-faqs-title">Frequently Asked Questions</h3>
          <div className="seo-faqs-list">
            {faqs.map((faq, idx) => (
              <details key={idx} className="seo-faq-item">
                <summary className="seo-faq-summary">
                  <span>{faq.q}</span>
                  <ChevronDown size={17} className="seo-faq-icon" />
                </summary>
                <div className="seo-faq-answer">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
