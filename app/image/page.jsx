import ImageStudioClient from './ImageStudioClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Free Online Image Studio — Compress, Resize & Convert | MintTools',
  description: 'Compress image file sizes, resize dimensions, and convert between WebP, PNG, and JPG formats directly in your browser. Fast and private.',
  keywords: ['image compressor online', 'image studio', 'resize image online', 'convert webp to png', 'convert png to jpg', 'photo optimizer browser'],
  openGraph: {
    title: 'Free Online Image Studio — Compress, Resize & Convert | MintTools',
    description: 'Compress image file sizes, resize dimensions, and convert formats with zero server uploads.',
    type: 'website'
  }
};

const imgFeatures = [
  {
    title: 'Smart Compression',
    desc: 'Shrink image file sizes by up to 80% while preserving sharp visual quality and colors.'
  },
  {
    title: 'Modern WebP Conversion',
    desc: 'Convert heavy PNG and JPG photos to lightweight modern WebP for faster website loading.'
  },
  {
    title: 'Instant Local Processing',
    desc: 'Runs on your device GPU/CPU — eliminating upload and download wait times completely.'
  }
];

const imgSteps = [
  { title: 'Select Image', desc: 'Tap to choose an image or drop it into the upload box.' },
  { title: 'Adjust Format & Size', desc: 'Select WebP, PNG, or JPEG, choose compression quality, and set dimensions.' },
  { title: 'Export Optimized File', desc: 'Download your optimized image with the exact file size reduction shown.' }
];

const imgFaqs = [
  {
    q: 'How do I compress an image without losing quality online?',
    a: 'MintTools uses browser-native canvas rendering with bicubic interpolation and quality scaling to remove unnecessary metadata and optimize color tables while keeping visuals crisp.'
  },
  {
    q: 'Are there limits on how many images I can optimize?',
    a: 'No. Since processing happens entirely on your own computer or phone, there are no daily quotas, rate limits, or paywalls.'
  },
  {
    q: 'Does this image converter add a watermark?',
    a: 'No. All processed images are 100% clean and watermark-free.'
  }
];

export default function Page() {
  return (
    <>
      <ImageStudioClient />
      <ToolSeoSection
        heading="Online Image Compressor & Format Converter"
        subheading="Reduce image file sizes, resize dimensions, and convert between WebP, PNG, and JPEG with zero quality loss."
        features={imgFeatures}
        steps={imgSteps}
        faqs={imgFaqs}
      />
    </>
  );
}
