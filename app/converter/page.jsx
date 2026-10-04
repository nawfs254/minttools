import ConverterClient from './ConverterClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Free Unit & Developer Converter – Data Sizes, CSS, Colors & Timestamps | MintTools',
  description: 'Convert between digital data sizes (Bytes to TB), CSS units (PX to REM), color spaces (HEX, RGB, HSL), and Unix epoch timestamps in real-time. 100% free and private.',
  keywords: ['unit converter', 'developer converter', 'px to rem converter', 'css units converter', 'hex to rgb', 'data size converter', 'unix timestamp converter'],
  openGraph: {
    title: 'Free Unit & Developer Converter – Data Sizes, CSS, Colors & Timestamps | MintTools',
    description: 'Instant multi-purpose developer converters for CSS rem/px, color codes, digital storage, and epoch timestamps.',
    type: 'website'
  }
};

const converterFeatures = [
  {
    title: 'Instant Multi-System Conversions',
    desc: 'Easily calculate CSS rem/px values, transform digital storage bytes up to Petabytes, convert color spaces, and parse timestamps simultaneously.'
  },
  {
    title: 'Precision & Standards Compliance',
    desc: 'Formulaic calculations adhere to IEEE digital storage standards, W3C CSS specifications, and RFC 3339 / ISO 8601 date-time protocols.'
  },
  {
    title: 'Zero Latency & Client-Side Execution',
    desc: 'Conversions compute on keystroke in your browser. No API requests, no tracking, and zero latency regardless of network connectivity.'
  }
];

const converterSteps = [
  { title: 'Select Converter Mode', desc: 'Choose between Data Storage, CSS Units (PX/REM), Color Codes, or Unix Timestamp.' },
  { title: 'Type or Paste Your Value', desc: 'Enter any number or color string; all corresponding units update dynamically in real time.' },
  { title: 'Copy with One Click', desc: 'Click any converted output to automatically copy formatted results directly to your clipboard.' }
];

const converterFaqs = [
  {
    q: 'How does the CSS PX to REM converter determine base font size?',
    a: 'By default, the converter uses the web standard base font size of 16px (1rem = 16px). You can also customize the root font size setting to match your custom web design configuration.'
  },
  {
    q: 'What is the difference between binary (GiB) and decimal (GB) storage units?',
    a: 'Decimal units (KB, MB, GB) use powers of 1,000 (1 KB = 1,000 Bytes) used by hard drive manufacturers and networking systems. Binary units (KiB, MiB, GiB) use powers of 1,024 (1 KiB = 1,024 Bytes) used by operating systems like Windows and macOS.'
  },
  {
    q: 'Which color models are supported for conversion?',
    a: 'MintTools supports two-way conversions between HEX (#RRGGBB, #RRGGBBAA), RGB / RGBA, HSL / HSLA, and CSS color keywords with real-time visual color swatch previews.'
  },
  {
    q: 'Can this tool convert historical or future Unix epoch timestamps?',
    a: 'Yes. You can convert timestamps in both seconds (10 digits) and milliseconds (13 digits) into UTC, local time zones, and ISO 8601 formatted strings.'
  },
  {
    q: 'Is my data or input logged or transmitted anywhere?',
    a: 'No. All calculations run completely locally inside your browser session using native JavaScript math utilities.'
  }
];

export default function Page() {
  return (
    <>
      <ConverterClient />
      <ToolSeoSection
        heading="Essential Developer & Unit Conversion Suite"
        subheading="Accurate, real-time conversion utilities built specifically for frontend developers, designers, and engineers."
        features={converterFeatures}
        steps={converterSteps}
        faqs={converterFaqs}
      />
    </>
  );
}
