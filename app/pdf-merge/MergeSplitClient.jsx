'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import WorkspaceLoader from '@/app/components/WorkspaceLoader';

const PDFMergeSplit = dynamic(() => import('@/src/components/PDFMergeSplit'), {
  ssr: false,
  loading: () => <WorkspaceLoader title="PDF Merge & Split" />
});

export default function MergeSplitClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <PDFMergeSplit showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
