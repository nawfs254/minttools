import QRReaderClient from './QRReaderClient';

export const metadata = {
  title: 'Online QR Code Scanner & Reader — Camera, Upload & Clipboard',
  description: 'Scan and read QR codes instantly from uploaded images, webcam/camera, or clipboard. 100% private, no server processing.',
  keywords: ["qr code reader","scan qr code online","qr scanner from image","webcam qr scanner","free qr reader"],
  openGraph: {
    title: 'Online QR Code Scanner & Reader — Camera, Upload & Clipboard',
    description: 'Scan and read QR codes instantly from uploaded images, webcam/camera, or clipboard. 100% private, no server processing.',
    type: 'website'
  }
};

export default function Page() {
  return <QRReaderClient />;
}
