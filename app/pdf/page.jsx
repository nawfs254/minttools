import PDFEditorClient from './PDFEditorClient';

export const metadata = {
  title: 'Free Online PDF Editor — Edit Text, Annotate & Sign',
  description: 'Edit PDF text directly in your browser. Add whiteout, highlights, text notes, and signatures. 100% private, no signup, zero file uploads.',
  keywords: ["free pdf editor","edit pdf text online","pdf annotator","pdf redact","private pdf editor","no upload pdf editor"],
  openGraph: {
    title: 'Free Online PDF Editor — Edit Text, Annotate & Sign',
    description: 'Edit PDF text directly in your browser. Add whiteout, highlights, text notes, and signatures. 100% private, no signup, zero file uploads.',
    type: 'website'
  }
};

export default function Page() {
  return <PDFEditorClient />;
}
