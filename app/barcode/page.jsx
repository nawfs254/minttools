import BarcodeClient from './BarcodeClient';

export const metadata = {
  title: 'Free Online Barcode Generator — Code 128, EAN-13, UPC',
  description: 'Generate and download retail and industrial barcodes in Code 128, EAN-13, UPC-A, and Code 39 standards with live preview.',
  keywords: ["barcode generator","create barcode online","code 128 generator","ean-13 generator","upc barcode","free barcode studio"],
  openGraph: {
    title: 'Free Online Barcode Generator — Code 128, EAN-13, UPC',
    description: 'Generate and download retail and industrial barcodes in Code 128, EAN-13, UPC-A, and Code 39 standards with live preview.',
    type: 'website'
  }
};

export default function Page() {
  return <BarcodeClient />;
}
