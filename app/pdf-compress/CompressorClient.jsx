'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const PDFCompressor = dynamic(() => import('@/src/components/PDFCompressor'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading PDF Compressor...</div>
});

export default function CompressorClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <PDFCompressor showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
