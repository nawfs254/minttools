import QRStudioClient from './QRStudioClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Best Free QR Code Generator Online — Custom Logo & Color (Never Expires) | MintTools',
  description: 'Create custom, permanent QR codes with colors, logos, and high-resolution PNG export. 100% free with no expiration, no account, and zero tracking.',
  keywords: [
    'best qr code generator',
    'best free qr code maker',
    'qr code generator never expires',
    'custom qr code with logo',
    'permanent qr code online',
    'free qr creator',
    'generate qr code free online',
    'wifi qr code generator'
  ],
  openGraph: {
    title: 'Best Free QR Code Generator Online — Custom Logo & Color (Never Expires) | MintTools',
    description: 'Create custom, permanent QR codes with colors, logos, and high-resolution PNG export. 100% free with no expiration.',
    type: 'website'
  }
};

const qrFeatures = [
  {
    title: 'Never Expires',
    desc: 'All generated QR codes are static and direct. They will never expire, redirect, or stop working.'
  },
  {
    title: 'Full Color & Size Control',
    desc: 'Customize background and foreground colors, error correction levels, and resolution up to 1000px.'
  },
  {
    title: 'High-Resolution PNG',
    desc: 'Export sharp, print-ready QR codes suitable for business cards, flyers, posters, and menus.'
  }
];

const qrSteps = [
  { title: 'Enter URL or Text', desc: 'Paste your website link, WiFi credentials, contact details, or plain text.' },
  { title: 'Style & Pick Colors', desc: 'Choose custom brand colors, margin spacing, and error correction level.' },
  { title: 'Download PNG', desc: 'Click download to export your high-resolution QR code instantly.' }
];

const qrFaqs = [
  {
    q: 'Do these QR codes expire or have scan limits?',
    a: 'No. MintTools creates standard static QR codes that encode your data directly into the pixel pattern. They never expire and have no scan limits.'
  },
  {
    q: 'Is this QR code generator safe and private?',
    a: 'Yes. All QR codes are generated entirely client-side using JavaScript in your browser. Your URLs and text are never transmitted to our servers.'
  },
  {
    q: 'Can I generate high-resolution QR codes for print?',
    a: 'Yes. You can set the resolution up to 1000px and select high error correction (Level H) for crisp scanning on printed materials.'
  }
];

export default function Page() {
  return (
    <>
      <QRStudioClient />
      <ToolSeoSection
        heading="Custom QR Code Generator with High-Res Export"
        subheading="Generate scannable, permanent QR codes for websites, WiFi, and contacts without expiration."
        features={qrFeatures}
        steps={qrSteps}
        faqs={qrFaqs}
      />
    </>
  );
}

