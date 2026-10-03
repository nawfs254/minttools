import MergeSplitClient from './MergeSplitClient';

export const metadata = {
  title: 'Merge & Split PDF Online — Combine or Extract Pages',
  description: 'Easily merge multiple PDF files into one or split and extract custom page ranges in seconds with visual reordering. 100% client-side.',
  keywords: ["merge pdf","split pdf","combine pdf files","extract pdf pages","private pdf merger","online pdf splitter"],
  openGraph: {
    title: 'Merge & Split PDF Online — Combine or Extract Pages',
    description: 'Easily merge multiple PDF files into one or split and extract custom page ranges in seconds with visual reordering. 100% client-side.',
    type: 'website'
  }
};

export default function Page() {
  return <MergeSplitClient />;
}
