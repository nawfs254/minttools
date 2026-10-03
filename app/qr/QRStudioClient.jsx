'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const QRStudio = dynamic(() => import('@/src/components/QRStudio'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading QR Studio...</div>
});

export default function QRStudioClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return (
    <QRStudio
      showToast={showToast}
      onBackToDashboard={() => router.push('/')}
      onOpenReader={() => router.push('/qr-reader')}
    />
  );
}
