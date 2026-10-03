import QRReaderClient from './QRReaderClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Online QR Code Scanner & Reader — Camera, Image & Clipboard | MintTools',
  description: 'Scan and read QR codes instantly from uploaded images, webcam/camera, or clipboard screenshot. 100% private, no server processing.',
  keywords: ['qr code scanner online', 'qr code reader', 'scan qr code online', 'qr scanner from image', 'webcam qr scanner', 'free qr reader'],
  openGraph: {
    title: 'Online QR Code Scanner & Reader — Camera, Image & Clipboard | MintTools',
    description: 'Scan and read QR codes instantly from uploaded images, webcam/camera, or clipboard.',
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
