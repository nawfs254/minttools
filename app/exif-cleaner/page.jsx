import ExifClient from './ExifClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Best Online EXIF Cleaner — Remove GPS Location & Photo Metadata Free | MintTools',
  description: 'Remove sensitive GPS location coordinates, camera models, and timestamps from photos before sharing online. 100% private, client-side metadata scrubbing.',
  keywords: [
    'best exif cleaner online',
    'remove gps from photo',
    'strip photo metadata online',
    'clean exif data free',
    'photo privacy tool',
    'delete exif metadata',
    'remove location from picture',
    'wipe camera metadata'
  ],
  openGraph: {
    title: 'Best Online EXIF Cleaner — Remove GPS Location & Photo Metadata Free | MintTools',
    description: 'Protect your privacy by stripping hidden GPS coordinates, device serial numbers, and shooting dates from your photos.',
    type: 'website'
  }
};

const exifFeatures = [
  {
    title: 'Complete Geolocation Privacy',
    desc: 'Wipe exact GPS coordinates (latitude, longitude, altitude) and address clues embedded into your smartphone and digital camera photos.'
  },
  {
    title: 'Preserves 100% Visual Quality',
    desc: 'Purges binary metadata tags without degrading image pixels, altering colors, or applying aggressive compression artifacts.'
  },
  {
    title: 'Zero Server Storage Risk',
    desc: 'Your personal photos and family pictures never leave your computer or phone. Processing occurs entirely in local RAM.'
  }
];

const exifSteps = [
  { title: 'Upload Image Files', desc: 'Select or drag & drop JPEG, PNG, or WebP images into the EXIF inspector canvas.' },
  { title: 'Inspect Hidden Tags', desc: 'Review existing metadata fields including camera model, lens parameters, ISO, shutter speed, and GPS location.' },
  { title: 'Download Cleaned Photos', desc: 'Click to scrub all metadata tags and save clean, privacy-safe photos ready for social media.' }
];

const exifFaqs = [
  {
    q: 'What is EXIF metadata and why should I remove it?',
    a: 'EXIF (Exchangeable Image File Format) data is recorded automatically by smartphones and cameras every time you take a photo. It frequently includes exact GPS latitude/longitude coordinates, your camera or phone serial number, and exact timestamps, which can compromise your home address and privacy when shared online.'
  },
  {
    q: 'Do social media platforms automatically remove EXIF data?',
    a: 'While some major platforms strip metadata upon upload, many messaging apps, email services, cloud drives, and forums preserve full EXIF data, allowing anyone who downloads your photo to view where and when it was taken.'
  },
  {
    q: 'Does removing EXIF metadata reduce photo resolution or quality?',
    a: 'No. Removing EXIF data only strips header metadata bytes. The visual image pixels, dimensions, and color profiles remain completely untouched at their original crisp quality.'
  },
  {
    q: 'Can I clean multiple photos at once?',
    a: 'Yes. MintTools allows you to inspect and batch clean metadata across multiple images in a single session with rapid processing.'
  },
  {
    q: 'Are my private photos uploaded to MintTools servers?',
    a: 'Never. MintTools operates on a strict zero-upload architecture. All metadata extraction and purging happens entirely inside your browser memory using HTML5 Canvas and ArrayBuffer APIs.'
  }
];

export default function Page() {
  return (
    <>
      <ExifClient />
      <ToolSeoSection
        heading="Secure Photo EXIF & Geolocation Metadata Remover"
        subheading="Safeguard your personal location and device privacy before publishing photos to the web or social media."
        features={exifFeatures}
        steps={exifSteps}
        faqs={exifFaqs}
      />
    </>
  );
}

