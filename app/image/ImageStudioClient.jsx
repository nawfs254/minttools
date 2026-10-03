'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const ImageStudio = dynamic(() => import('@/src/components/ImageStudio'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Image Studio...</div>
});

export default function ImageStudioClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <ImageStudio showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
