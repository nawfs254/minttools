import MergeSplitClient from './MergeSplitClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Free Online PDF Merge & Split – Combine & Extract Pages | MintTools',
  description: 'Merge multiple PDF files into one clean document, or split and extract specific pages. 100% private, zero uploads, instant browser processing.',
  keywords: ['merge pdf', 'split pdf', 'combine pdf files', 'extract pdf pages', 'pdf joiner', 'pdf separator', 'free pdf merger online'],
  openGraph: {
    title: 'Free Online PDF Merge & Split – Combine & Extract Pages | MintTools',
    description: 'Combine multiple PDF documents or split large PDF files into distinct chapters with zero server upload latency.',
    type: 'website'
  }
};

const pdfMergeFeatures = [
  {
    title: 'Unlimited File Combining',
    desc: 'Collate contracts, tax documents, academic research, and reports in your exact preferred sequence without arbitrary page limits.'
  },
  {
    title: 'Precise Page Range Splitting',
    desc: 'Extract individual pages, split documents into separate chapters, or eliminate unneeded pages before sharing.'
  },
  {
    title: '100% Client-Side Confidentiality',
    desc: 'Your confidential legal agreements and financial statements are manipulated locally in your browser with zero server uploads.'
  }
];

const pdfMergeSteps = [
  { title: 'Add PDF Documents', desc: 'Select or drag & drop two or more PDF files into the merge workspace.' },
  { title: 'Reorder or Set Ranges', desc: 'Drag files to arrange the sequence, or specify custom page ranges to extract.' },
  { title: 'Download Merged PDF', desc: 'Click to compile and download your consolidated PDF file instantly without watermarks.' }
];

const pdfMergeFaqs = [
  {
    q: 'Can I merge PDF files with different page orientations or sizes?',
    a: 'Yes. MintTools supports merging documents containing mixed orientations (portrait and landscape) and mixed page dimensions (A4, US Letter, Legal) while preserving each original page format.'
  },
  {
    q: 'Are bookmarks, forms, and links preserved when merging?',
    a: 'MintTools uses modern PDF-Lib compilation to preserve embedded fonts, vector graphics, high-resolution imagery, and document integrity across merged files.'
  },
  {
    q: 'Is there a limit on how many PDF files I can merge?',
    a: 'Because processing runs client-side in your device memory rather than on congested servers, you can merge dozens of files at once without artificial file caps.'
  },
  {
    q: 'Can I delete specific pages from a PDF before downloading?',
    a: 'Yes. In split mode, you can select which pages to extract or remove unwanted pages from a multi-page document before saving the output.'
  },
  {
    q: 'Are my confidential documents uploaded to a remote server?',
    a: 'Never. MintTools processes all PDF binary data directly in your browser using WebAssembly. No files are uploaded, stored, or viewed by anyone.'
  }
];

export default function Page() {
  return (
    <>
      <MergeSplitClient />
      <ToolSeoSection
        heading="Professional PDF Merge & Document Splitting Studio"
        subheading="Seamlessly consolidate contracts, reports, and books or extract individual pages with zero server upload risks."
        features={pdfMergeFeatures}
        steps={pdfMergeSteps}
        faqs={pdfMergeFaqs}
      />
    </>
  );
}
