'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import WorkspaceLoader from '@/app/components/WorkspaceLoader';

const PDFCompressor = dynamic(() => import('@/src/components/PDFCompressor'), {
  ssr: false,
  loading: () => <WorkspaceLoader title="PDF Compressor" />
});

export default function CompressorClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <PDFCompressor showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
