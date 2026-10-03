import ImageStudioClient from './ImageStudioClient';

export const metadata = {
  title: 'Free Image Studio — Compress, Resize & Convert Images',
  description: 'Compress image file sizes, resize dimensions, and convert between WebP, PNG, and JPG formats directly in your browser.',
  keywords: ["image compressor","resize image","convert webp to png","convert png to jpg","online photo editor","client image tool"],
  openGraph: {
    title: 'Free Image Studio — Compress, Resize & Convert Images',
    description: 'Compress image file sizes, resize dimensions, and convert between WebP, PNG, and JPG formats directly in your browser.',
    type: 'website'
  }
};

export default function Page() {
  return <ImageStudioClient />;
}
