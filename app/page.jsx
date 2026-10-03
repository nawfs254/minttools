import HomeClient from './HomeClient';

export const metadata = {
  title: 'MintTools — 100% Free & Privacy-First Web Tools Suite',
  description: 'Fast, secure, and private browser-based utilities: PDF Editor, Compressor, Merge & Split, Barcode & QR Studio, Image Tools, and Developer Converters. Zero uploads.',
  keywords: ["privacy tools","web tools","pdf editor","qr code generator","image compressor","client side tools","free web utilities"],
  openGraph: {
    title: 'MintTools — 100% Free & Privacy-First Web Tools Suite',
    description: 'Fast, secure, and private browser-based utilities: PDF Editor, Compressor, Merge & Split, Barcode & QR Studio, Image Tools, and Developer Converters. Zero uploads.',
    type: 'website'
  }
};

export default function Page() {
  return <HomeClient />;
}
