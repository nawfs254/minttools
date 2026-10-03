import CompressorClient from './CompressorClient';

export const metadata = {
  title: 'Free PDF Compressor Online — Reduce File Size Privately',
  description: 'Compress PDF files directly on your computer or phone with maximum visual quality. Zero server uploads, private and instant.',
  keywords: ["compress pdf","reduce pdf size","online pdf compressor","private pdf compress","fast pdf compression"],
  openGraph: {
    title: 'Free PDF Compressor Online — Reduce File Size Privately',
    description: 'Compress PDF files directly on your computer or phone with maximum visual quality. Zero server uploads, private and instant.',
    type: 'website'
  }
};

export default function Page() {
  return <CompressorClient />;
}
