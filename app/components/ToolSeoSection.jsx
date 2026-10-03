import React from 'react';
import { ShieldCheck, Zap, Lock, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function ToolSeoSection({
  heading = 'Everything You Need to Know',
  subheading = 'Fast, secure, and processed 100% inside your browser.',
  features = [],
  steps = [],
  faqs = []
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
