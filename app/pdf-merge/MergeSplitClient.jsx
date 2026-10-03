'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const PDFMergeSplit = dynamic(() => import('@/src/components/PDFMergeSplit'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading PDF Merge & Split...</div>
});

export default function MergeSplitClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <PDFMergeSplit showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
