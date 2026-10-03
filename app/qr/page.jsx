import QRStudioClient from './QRStudioClient';

export const metadata = {
  title: 'Custom QR Code Generator & Studio — Colors & Download',
  description: 'Create customizable high-resolution QR codes with custom colors, sizes, error correction, and instant PNG download.',
  keywords: ["qr code generator","custom qr code","create qr code free","color qr code","high res qr code"],
  openGraph: {
    title: 'Custom QR Code Generator & Studio — Colors & Download',
    description: 'Create customizable high-resolution QR codes with custom colors, sizes, error correction, and instant PNG download.',
    type: 'website'
  }
};

export default function Page() {
  return <QRStudioClient />;
}
