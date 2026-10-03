'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import WorkspaceLoader from '@/app/components/WorkspaceLoader';

const QRStudio = dynamic(() => import('@/src/components/QRStudio'), {
  ssr: false,
  loading: () => <WorkspaceLoader title="QR Code Studio" />
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
