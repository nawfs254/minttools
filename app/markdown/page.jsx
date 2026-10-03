import MarkdownClient from './MarkdownClient';

export const metadata = {
  title: 'Online Markdown Editor with Instant PDF Export',
  description: 'Fast, distraction-free Markdown editor with live preview, syntax highlighting, and 1-click vector PDF document export.',
  keywords: ["markdown editor","markdown to pdf","online markdown writer","export markdown as pdf","live markdown preview"],
  openGraph: {
    title: 'Online Markdown Editor with Instant PDF Export',
    description: 'Fast, distraction-free Markdown editor with live preview, syntax highlighting, and 1-click vector PDF document export.',
    type: 'website'
  }
};

export default function Page() {
  return <MarkdownClient />;
}
