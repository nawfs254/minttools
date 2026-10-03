import PDFEditorClient from './PDFEditorClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Free Online PDF Editor — Edit Text, Annotate, Whiteout & Sign | MintTools',
  description: 'Edit PDF text directly in your browser. Add whiteout, annotations, text notes, and signatures. 100% private, no signup, zero file uploads.',
  keywords: ['free pdf editor', 'edit pdf text online', 'pdf annotator', 'pdf redact', 'private pdf editor', 'no upload pdf editor', 'online pdf editor free'],
  openGraph: {
    title: 'Free Online PDF Editor — Edit Text, Annotate, Whiteout & Sign | MintTools',
    description: 'Edit PDF text directly in your browser. Add whiteout, annotations, and signatures with zero server uploads.',
    type: 'website'
  }
};

const pdfFeatures = [
  {
    title: '100% Client-Side Privacy',
    desc: 'Your documents are processed entirely in browser memory. No files are ever uploaded or stored on any server.'
  },
  {
    title: 'Zero Watermarks',
    desc: 'Export clean, original-quality PDF documents with no ads, branding, or watermarks added.'
  },
  {
    title: 'No Account Required',
    desc: 'Start editing instantly without signing up, providing an email, or entering credit card details.'
  }
];

const pdfSteps = [
  { title: 'Open Your PDF', desc: 'Select any PDF file or drop it into the workspace canvas.' },
  { title: 'Edit & Annotate', desc: 'Add text, whiteout confidential areas, highlight text, or insert signatures.' },
  { title: 'Download Instantly', desc: 'Save the edited PDF directly to your device with zero upload latency.' }
];

const pdfFaqs = [
  {
    q: 'Can I edit text in a PDF online for free?',
    a: 'Yes. MintTools allows you to edit text, insert new typography, redact information, and annotate existing PDF documents for free with no subscriptions or software installs.'
  },
  {
    q: 'Is my confidential PDF uploaded to your servers?',
    a: 'Never. MintTools operates on a strict zero-server-upload architecture. All rendering, editing, and compiling happens locally on your computer or phone using WebAssembly and HTML5 Canvas.'
  },
  {
    q: 'Can I sign documents using this online PDF editor?',
    a: 'Yes. You can draw your signature directly on the canvas or type your name, position it onto the signature line, and export the signed document immediately.'
  },
  {
    q: 'Does this editor work on mobile devices?',
    a: 'Yes. MintTools PDF Editor is fully responsive and supports touch devices across iOS, iPadOS, Android, and desktop browsers.'
  }
];

export default function Page() {
  return (
    <>
      <PDFEditorClient />
      <ToolSeoSection
        heading="Free Online PDF Editor with True Privacy"
        subheading="Edit text, add annotations, whiteout sensitive details, and sign documents with zero server uploads."
        features={pdfFeatures}
        steps={pdfSteps}
        faqs={pdfFaqs}
      />
    </>
  );
}
