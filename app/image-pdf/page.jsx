import ImagePDFClient from './ImagePDFClient';

export const metadata = {
  title: 'Convert Images to PDF & PDF to Image Online',
  description: 'Batch convert JPG, PNG, and WebP photos to high quality PDF, or extract all PDF pages into high-resolution images instantly.',
  keywords: ["images to pdf","jpg to pdf","png to pdf","pdf to image","pdf to png","extract images from pdf"],
  openGraph: {
    title: 'Convert Images to PDF & PDF to Image Online',
    description: 'Batch convert JPG, PNG, and WebP photos to high quality PDF, or extract all PDF pages into high-resolution images instantly.',
    type: 'website'
  }
};

export default function Page() {
  return <ImagePDFClient />;
}
