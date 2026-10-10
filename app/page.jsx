import HomeClient from './HomeClient';

export const metadata = {
  title: 'MintTools — Best Free & Privacy-First Web Tools Suite Online',
  description: 'Top-rated 100% free web utilities: Best Online PDF Editor, PDF Compressor, Barcode & QR Studio, Image Tools, and Developer Converters. Zero uploads.',
  keywords: [
    'best free online tools',
    'best pdf editor online',
    'free qr code generator',
    'barcode generator online',
    'pdf compressor no limit',
    'private web utilities',
    'zero upload tools',
    'free developer tools online'
  ],
  openGraph: {
    title: 'MintTools — Best Free & Privacy-First Web Tools Suite Online',
    description: 'Fast, secure, and private browser-based utilities: PDF Editor, Compressor, Merge & Split, Barcode & QR Studio, Image Tools, and Developer Converters. Zero uploads.',
    type: 'website'
  }
};

export default function Page() {
  return <HomeClient />;
}
