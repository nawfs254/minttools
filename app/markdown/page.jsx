import MarkdownClient from './MarkdownClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Best Free Markdown Editor Online — Live Preview & PDF/HTML Export | MintTools',
  description: 'Distraction-free Markdown editor with side-by-side live preview, GitHub-flavored markdown (GFM) support, and 1-click PDF/HTML export. 100% private.',
  keywords: [
    'best markdown editor online',
    'markdown live preview online',
    'markdown to pdf converter',
    'free online markdown editor',
    'gfm markdown writer',
    'markdown to html',
    'distraction free markdown',
    'browser markdown editor'
  ],
  openGraph: {
    title: 'Best Free Markdown Editor Online — Live Preview & PDF/HTML Export | MintTools',
    description: 'Distraction-free markdown editor with live synchronized preview and one-click PDF, HTML, and Markdown file export.',
    type: 'website'
  }
};

const markdownFeatures = [
  {
    title: 'Synchronized Split-Screen Preview',
    desc: 'Type with instant real-time live preview rendering formatted headings, tables, code blocks, task lists, and quotes as you type.'
  },
  {
    title: 'Multi-Format Export (PDF, HTML, MD)',
    desc: 'Export your written document as an elegant printable vector PDF, clean standalone HTML markup, or raw .md file.'
  },
  {
    title: '100% Local Privacy & No Account',
    desc: 'Your meeting notes, articles, and documentation stay strictly inside your browser memory. Nothing is ever sent to or stored in the cloud.'
  }
];

const markdownSteps = [
  { title: 'Write or Paste Notes', desc: 'Type your text using standard Markdown or load an existing markdown file from your device.' },
  { title: 'Preview & Format', desc: 'Watch your formatted typography, tables, and code snippets render in the real-time preview panel.' },
  { title: 'Export Instantly', desc: 'Download as a polished PDF document, export raw HTML, or save as a standard .md file.' }
];

const markdownFaqs = [
  {
    q: 'Does this editor support GitHub Flavored Markdown (GFM)?',
    a: 'Yes. MintTools supports the full GitHub Flavored Markdown specification including tables, strikethrough, task checklists, fenced code blocks with language highlighting, and autolinks.'
  },
  {
    q: 'How does the Markdown to PDF export work?',
    a: 'The PDF exporter formats your markdown typography into clean, publication-ready pages with custom margins, standard headers, and preserved syntax colors.'
  },
  {
    q: 'Does MintTools store my notes or articles on a server?',
    a: 'No. Everything you write is processed strictly in your local browser sandbox. No text or documents are ever uploaded to any database.'
  },
  {
    q: 'Can I copy the compiled HTML directly?',
    a: 'Yes. You can copy the generated HTML source with a single click to paste directly into your blog, static site generator, or CMS.'
  },
  {
    q: 'Does this markdown editor work offline?',
    a: 'Yes. Once loaded, the markdown parser and renderer function fully offline without requiring any server roundtrips.'
  }
];

export default function Page() {
  return (
    <>
      <MarkdownClient />
      <ToolSeoSection
        heading="Distraction-Free Markdown Writing Studio"
        subheading="A clean, responsive workspace for technical writers, developers, and note-takers with instant multi-format output."
        features={markdownFeatures}
        steps={markdownSteps}
        faqs={markdownFaqs}
      />
    </>
  );
}

