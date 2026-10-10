import QRReaderClient from './QRReaderClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Best Online QR Code Scanner & Reader — Camera & Image Upload | MintTools',
  description: 'Scan and decode QR codes online using your camera, image upload, or clipboard paste. Fast, private, and 100% client-side with safe link inspection.',
  keywords: [
    'best qr scanner online',
    'scan qr code from image',
    'online qr reader camera',
    'read qr code from screenshot',
    'qr code scanner pc',
    'browser qr code scanner',
    'decode qr code online',
    'safe qr scanner'
  ],
  openGraph: {
    title: 'Best Online QR Code Scanner & Reader — Camera & Image Upload | MintTools',
    description: 'Scan and decode QR codes online using your camera, image upload, or clipboard paste. Fast, private, and 100% client-side.',
    type: 'website'
  }
};

const scannerFeatures = [
  {
    title: 'Camera & Image Support',
    desc: 'Scan live using your phone or laptop camera, or upload an image file containing a QR code.'
  },
  {
    title: 'Clipboard Paste (Ctrl+V)',
    desc: 'Take a screenshot on your computer or phone, press Ctrl+V, and decode it instantly.'
  },
  {
    title: 'Safe URL Inspection',
    desc: 'Inspect the decoded destination link before opening it to protect yourself from malicious URLs.'
  }
];

const scannerSteps = [
  { title: 'Choose Input', desc: 'Select your device camera, upload an image file, or paste from clipboard.' },
  { title: 'Instant Decode', desc: 'The computer vision engine detects and decodes the QR matrix in milliseconds.' },
  { title: 'Copy or Open', desc: 'View the decoded text or safely open the link with one click.' }
];

const scannerFaqs = [
  {
    q: 'Can I scan a QR code from a picture or screenshot?',
    a: 'Yes. You can upload any image (PNG, JPG, WebP) or paste a screenshot directly with Ctrl+V to read the QR code without using a camera.'
  },
  {
    q: 'Does the scanner upload my camera stream or pictures to a server?',
    a: 'No. The QR scanning engine runs 100% locally in your browser using pure JavaScript computer vision. No camera frames or image data ever leave your device.'
  },
  {
    q: 'Can I scan QR codes on my phone browser without downloading an app?',
    a: 'Yes. MintTools QR Scanner works directly in mobile Safari, Chrome, and Firefox on iOS and Android without installing any app.'
  }
];

export default function Page() {
  return (
    <>
      <QRReaderClient />
      <ToolSeoSection
        heading="Instant Online QR Code Scanner & Reader"
        subheading="Scan QR codes directly from your camera, webcam, uploaded image file, or copied screenshot."
        features={scannerFeatures}
        steps={scannerSteps}
        faqs={scannerFaqs}
      />
    </>
  );
}

