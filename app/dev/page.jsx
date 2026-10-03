import DevClient from './DevClient';

export const metadata = {
  title: 'Online Developer Tools — JSON Formatter, Base64 & Hashes',
  description: 'Format and minify JSON, encode/decode Base64 strings, and calculate MD5, SHA-1, SHA-256 cryptographic hashes in your browser.',
  keywords: ["developer tools","json formatter","base64 encoder","sha256 hash calculator","online dev utilities"],
  openGraph: {
    title: 'Online Developer Tools — JSON Formatter, Base64 & Hashes',
    description: 'Format and minify JSON, encode/decode Base64 strings, and calculate MD5, SHA-1, SHA-256 cryptographic hashes in your browser.',
    type: 'website'
  }
};

export default function Page() {
  return <DevClient />;
}
