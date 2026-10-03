import ConverterClient from './ConverterClient';

export const metadata = {
  title: 'Unit & Developer Converter — Data Sizes, CSS Units, Colors',
  description: 'Convert Data sizes (B, KB, MB, GB, TB), CSS units (px, rem, em), color formats (HEX, RGB, HSL), and Unix epoch timestamps.',
  keywords: ["dev converter","css unit converter","px to rem","data size converter","hex to rgb","unix timestamp converter"],
  openGraph: {
    title: 'Unit & Developer Converter — Data Sizes, CSS Units, Colors',
    description: 'Convert Data sizes (B, KB, MB, GB, TB), CSS units (px, rem, em), color formats (HEX, RGB, HSL), and Unix epoch timestamps.',
    type: 'website'
  }
};

export default function Page() {
  return <ConverterClient />;
}
