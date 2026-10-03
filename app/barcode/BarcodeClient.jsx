'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const BarcodeStudio = dynamic(() => import('@/src/components/BarcodeStudio'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Barcode Studio...</div>
});

export default function BarcodeClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <BarcodeStudio showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
