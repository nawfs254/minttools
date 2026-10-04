import BarcodeClient from './BarcodeClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Free Online Barcode Generator – Code 128, EAN-13, UPC, Code 39 | MintTools',
  description: 'Generate high-resolution retail, inventory, and logistics barcodes in Code 128, EAN-13, UPC-A, and Code 39. 100% private, free vector SVG and PNG export.',
  keywords: ['barcode generator', 'free barcode studio', 'create barcode online', 'code 128 generator', 'ean 13 generator', 'upc barcode generator', 'retail barcode maker'],
  openGraph: {
    title: 'Free Online Barcode Generator – Code 128, EAN-13, UPC, Code 39 | MintTools',
    description: 'Create and download scannable barcodes in Code 128, EAN-13, UPC-A, and Code 39 with instant live preview and zero uploads.',
    type: 'website'
  }
};

const barcodeFeatures = [
  {
    title: 'Universal Symbology Standards',
    desc: 'Generate industry-compliant barcodes including Code 128, EAN-13, UPC-A, Code 39, ITF-14, and Pharmacode for retail, inventory, and logistics.'
  },
  {
    title: 'High-Resolution Vector Export',
    desc: 'Download infinite-resolution SVG vectors for commercial packaging and product labels, or high-DPI PNGs for thermal label printers.'
  },
  {
    title: '100% Client-Side Privacy',
    desc: 'All barcodes are rendered locally in your browser memory. Your inventory SKUs, serial numbers, and product codes are never transmitted to any server.'
  }
];

const barcodeSteps = [
  { title: 'Choose Barcode Format', desc: 'Select Code 128 (general purpose), EAN-13 or UPC-A (retail products), or Code 39 (industrial).' },
  { title: 'Enter Value & Customize', desc: 'Type your alphanumeric or numeric code, adjust bar thickness, height, color, and display text.' },
  { title: 'Download Clean Label', desc: 'Instantly download your barcode in transparent PNG or scalable vector SVG ready for printing.' }
];

const barcodeFaqs = [
  {
    q: 'What is the difference between Code 128, EAN-13, and UPC-A?',
    a: 'Code 128 is a versatile, high-density symbology that supports both numbers and letters, widely used in shipping, logistics, and inventory management. EAN-13 and UPC-A are international retail standards specifically designed for commercial product packaging and point-of-sale checkout scanners.'
  },
  {
    q: 'Can I print these barcodes on thermal label printers like Zebra or Brother?',
    a: 'Yes. You can export high-contrast PNG or SVG files that print crisply on standard thermal transfer, direct thermal, and standard laser printers without blurring scan lines.'
  },
  {
    q: 'Are barcodes generated on MintTools valid for retail sales?',
    a: 'Yes, provided you own a valid GS1 registered product number for EAN-13 or UPC-A. MintTools encodes your provided standard numbers with exact checksum calculation and guard bar compliance.'
  },
  {
    q: 'Can I change the barcode color and font size?',
    a: 'Yes. MintTools allows you to customize the bar color, background color, display font size, text margin, and label padding to match your packaging aesthetics.'
  },
  {
    q: 'Does MintTools store or track the barcode data I generate?',
    a: 'Never. MintTools operates on a zero-server upload model. All barcode generation takes place strictly inside your browser session using JavaScript and HTML5 Canvas.'
  }
];

export default function Page() {
  return (
    <>
      <BarcodeClient />
      <ToolSeoSection
        heading="Professional Barcode Generator for Retail & Logistics"
        subheading="Generate crisp, verifiable linear barcodes formatted to global GS1 and ISO standards."
        features={barcodeFeatures}
        steps={barcodeSteps}
        faqs={barcodeFaqs}
      />
    </>
  );
}
