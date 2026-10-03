import CompressorClient from './CompressorClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Free Online PDF Compressor — Reduce PDF Size with Zero Uploads | MintTools',
  description: 'Shrink large PDF documents directly on your device. Fast, secure, and 100% client-side with zero server uploads.',
  keywords: ['compress pdf online free', 'reduce pdf size', 'compress pdf no upload', 'private pdf compressor', 'shrink pdf file'],
  openGraph: {
    title: 'Free Online PDF Compressor — Reduce PDF Size with Zero Uploads | MintTools',
    description: 'Shrink large PDF documents directly on your device with 100% client-side privacy.',
    type: 'website'
  }
};

const compressFeatures = [
  {
    title: 'Confidential & Private',
    desc: 'Legal contracts, medical records, and bank statements stay secure on your device.'
  },
  {
    title: 'Lossless Downsampling',
    desc: 'Removes duplicate objects, optimizes streams, and downsamples embedded imagery.'
  },
  {
    title: 'Zero File Size Caps',
    desc: 'Compress large documents without being blocked by 10MB or 25MB paywall limits.'
  }
];

const compressSteps = [
  { title: 'Open Document', desc: 'Drop your heavy PDF file into the compressor.' },
  { title: 'Select Compression Level', desc: 'Choose Recommended, Extreme, or Low compression depending on your needs.' },
  { title: 'Save Compressed PDF', desc: 'Download the reduced PDF file instantly with zero server latency.' }
];

const compressFaqs = [
  {
    q: 'Is it safe to compress confidential PDFs online?',
    a: 'With MintTools, it is completely safe because your PDF is never sent over the internet to a third-party server. All compression algorithms execute inside your local browser memory.'
  },
  {
    q: 'How much can I reduce my PDF file size?',
    a: 'Depending on the document content and embedded images, PDF file sizes can typically be reduced by 30% to 75%.'
  },
  {
    q: 'Is this PDF compressor free?',
    a: 'Yes, 100% free with unlimited compressions and zero watermarks.'
  }
];

export default function Page() {
  return (
    <>
      <CompressorClient />
      <ToolSeoSection
        heading="Private PDF Compressor with Zero Server Uploads"
        subheading="Shrink large PDF documents directly on your device. Fast, secure, and 100% client-side."
        features={compressFeatures}
        steps={compressSteps}
        faqs={compressFaqs}
      />
    </>
  );
}
