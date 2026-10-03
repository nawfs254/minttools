'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const MarkdownEditor = dynamic(() => import('@/src/components/MarkdownEditor'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Markdown Editor...</div>
});

export default function MarkdownClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <MarkdownEditor showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
