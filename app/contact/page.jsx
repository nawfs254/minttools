import React from 'react';
import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact MintTools — Support, Feedback & Inquiries',
  description: 'Get in touch with the MintTools team for support, feature suggestions, bug reports, and general feedback. We respond within 24–48 hours.',
  openGraph: {
    title: 'Contact MintTools — Support, Feedback & Inquiries',
    description: 'Reach out to the MintTools team for support, feature suggestions, or business inquiries.',
    type: 'website',
  }
};

export default function ContactPage() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact MintTools',
    description: 'Get in touch with the MintTools team for support, feedback, and technical inquiries.',
    mainEntity: {
      '@type': 'Organization',
      name: 'MintTools',
      url: 'https://www.minttools.net',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@minttools.net',
        contactType: 'customer support',
        availableLanguage: ['English']
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <ContactClient />
    </>
  );
}
