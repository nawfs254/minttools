import DevClient from './DevClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Best Online Developer Tools — JSON Formatter, Base64, Hash & Diff | MintTools',
  description: 'Essential browser developer utilities: format & minify JSON, encode/decode Base64, generate SHA-256 and MD5 hashes, and inspect text diffs. 100% private.',
  keywords: [
    'best online developer tools',
    'best json formatter online',
    'base64 encoder decoder',
    'sha256 hash generator online',
    'online text diff checker',
    'json validator free',
    'developer utilities browser',
    'private json formatter'
  ],
  openGraph: {
    title: 'Best Online Developer Tools — JSON Formatter, Base64, Hash & Diff | MintTools',
    description: 'Secure, client-side browser developer tools for JSON formatting, Base64 encoding, SHA/MD5 hashing, and diff inspection.',
    type: 'website'
  }
};

const devFeatures = [
  {
    title: 'Zero Leakage Confidentiality',
    desc: 'Never risk leaking proprietary tokens, API keys, JSON database dumps, or passwords. Data stays 100% in your local browser sandbox.'
  },
  {
    title: 'Instant Syntax Highlighting & Validation',
    desc: 'Detect JSON parse errors with precise line and column markers, beautify nested structures with 2-space or 4-space indentation, or minify for production.'
  },
  {
    title: 'Multi-Utility Developer Hub',
    desc: 'Switch effortlessly between JSON Formatting, Base64 Encoding/Decoding, Cryptographic Hashing (SHA-256, MD5), and Visual Text Diffing in one tab.'
  }
];

const devSteps = [
  { title: 'Select Tool Module', desc: 'Choose JSON Formatter, Base64 Converter, Hash Generator, or Text Diff tool.' },
  { title: 'Paste Your Code or Payload', desc: 'Input your raw string or document; the parser validates syntax and formats instantly.' },
  { title: 'Copy or Download Output', desc: 'Copy clean, formatted code, minified payloads, or encoded strings with one click.' }
];

const devFaqs = [
  {
    q: 'Is it safe to paste confidential JSON payloads or tokens into this tool?',
    a: 'Yes, completely safe. Unlike other online formatters that send your payloads to backend servers, MintTools processes everything exclusively on your client device using browser JavaScript.'
  },
  {
    q: 'Can the JSON Formatter handle large files (e.g. 10MB+)?',
    a: 'Yes. MintTools utilizes streaming and efficient memory parsing to handle large JSON documents and multi-megabyte payloads smoothly without freezing your browser tab.'
  },
  {
    q: 'What cryptographic hash algorithms are supported?',
    a: 'We support SHA-256, SHA-512, SHA-1, and MD5 hashes calculated using the browser-native Web Cryptography API (crypto.subtle) for maximum performance and security.'
  },
  {
    q: 'Does the Base64 tool support UTF-8 and Unicode characters?',
    a: 'Yes. Our Base64 encoder and decoder properly handles full multi-byte UTF-8 character sets, emojis, and special international symbols without character corruption.'
  },
  {
    q: 'Can I use this developer suite offline?',
    a: 'Yes. Once loaded, MintTools operates offline without requiring any active internet connection or external server requests.'
  }
];

export default function Page() {
  return (
    <>
      <DevClient />
      <ToolSeoSection
        heading="All-in-One Browser Developer Toolset"
        subheading="Engineered for software developers, DevOps professionals, and security engineers who value speed, privacy, and precision."
        features={devFeatures}
        steps={devSteps}
        faqs={devFaqs}
      />
    </>
  );
}

