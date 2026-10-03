'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import WorkspaceLoader from '@/app/components/WorkspaceLoader';

const BarcodeStudio = dynamic(() => import('@/src/components/BarcodeStudio'), {
  ssr: false,
  loading: () => <WorkspaceLoader title="Barcode Studio" />
});

export default function BarcodeClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <BarcodeStudio showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
