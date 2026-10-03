'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const PDFEditor = dynamic(() => import('@/src/components/PDFEditor'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading PDF Editor...</div>
});

export default function PDFEditorClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <PDFEditor showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
