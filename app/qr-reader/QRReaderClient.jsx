'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import WorkspaceLoader from '@/app/components/WorkspaceLoader';

const QRReader = dynamic(() => import('@/src/components/QRReader'), {
  ssr: false,
  loading: () => <WorkspaceLoader title="QR Code Reader" />
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
