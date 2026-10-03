'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const QRReader = dynamic(() => import('@/src/components/QRReader'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading QR Reader...</div>
});

export default function QRReaderClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return (
    <QRReader
      showToast={showToast}
      onBackToDashboard={() => router.push('/')}
      onOpenInStudio={(text) => router.push('/qr')}
    />
  );
}
