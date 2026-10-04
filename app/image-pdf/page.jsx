import ImagePDFClient from './ImagePDFClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Free Image to PDF Converter – Convert JPG, PNG & WebP to PDF | MintTools',
  description: 'Convert JPG, PNG, and WebP pictures into clean multi-page PDF documents, or extract PDF pages to high-resolution images. 100% free with zero file uploads.',
  keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'convert photos to pdf', 'pdf to image', 'pdf to jpg', 'free image to pdf online'],
  openGraph: {
    title: 'Free Image to PDF Converter – Convert JPG, PNG & WebP to PDF | MintTools',
    description: 'Combine photos, scans, and receipts into organized PDF documents with customizable page margins and orientation.',
    type: 'website'
  }
};

const imagePdfFeatures = [
  {
    title: 'Multi-Page Photo Collation',
    desc: 'Seamlessly combine multiple JPG, PNG, and WebP images into a single professional PDF document with drag-and-drop page reordering.'
  },
  {
    title: 'Custom Orientation & Margins',
    desc: 'Choose between Portrait or Landscape layout, adjust page margins (None, Small, Large), and fit images proportionally without distortion.'
  },
  {
    title: '100% Client-Side Confidentiality',
    desc: 'Scanned contracts, sensitive IDs, and confidential receipts are processed directly inside your browser with zero server uploads.'
  }
];

const imagePdfSteps = [
  { title: 'Upload Your Photos', desc: 'Select or drag & drop one or multiple images into the converter workspace.' },
  { title: 'Arrange & Configure', desc: 'Drag thumbnails to reorder pages, choose orientation, and customize margin spacing.' },
  { title: 'Download Merged PDF', desc: 'Click convert to compile your images into an organized, high-resolution PDF document.' }
];

const imagePdfFaqs = [
  {
    q: 'How many images can I combine into a single PDF?',
    a: 'You can combine as many images as your browser device memory allows—typically dozens or even hundreds of photos without issue. MintTools does not impose artificial limits.'
  },
  {
    q: 'Can I reorder images before generating the PDF?',
    a: 'Yes. You can easily drag and drop image thumbnails to arrange the exact page order you want before downloading the final PDF document.'
  },
  {
    q: 'Will the image quality or clarity be degraded?',
    a: 'No. MintTools preserves the original high resolution and color fidelity of your photos so that text on receipts, IDs, and document scans remains sharp and legible.'
  },
  {
    q: 'Can I also convert PDF pages back to images?',
    a: 'Yes. The two-way studio also allows you to upload existing PDF documents and extract every page as a high-resolution PNG or JPG image file.'
  },
  {
    q: 'Are my scanned IDs or bank statements stored on your servers?',
    a: 'Never. MintTools processes all files 100% on your device using client-side JavaScript libraries (pdf-lib & pdfjs-dist). No files are uploaded to any server.'
  }
];

export default function Page() {
  return (
    <>
      <ImagePDFClient />
      <ToolSeoSection
        heading="Two-Way Image and PDF Conversion Studio"
        subheading="Quickly assemble multi-page PDF documents from images or export PDF pages as individual high-res image files."
        features={imagePdfFeatures}
        steps={imagePdfSteps}
        faqs={imagePdfFaqs}
      />
    </>
  );
}
