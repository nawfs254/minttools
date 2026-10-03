'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const ExifCleaner = dynamic(() => import('@/src/components/ExifCleaner'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading EXIF Cleaner...</div>
});

export default function ExifClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <ExifCleaner showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
