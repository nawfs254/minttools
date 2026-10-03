'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import WorkspaceLoader from '@/app/components/WorkspaceLoader';

const PDFEditor = dynamic(() => import('@/src/components/PDFEditor'), {
  ssr: false,
  loading: () => <WorkspaceLoader title="PDF Editor" />
});

export default function PDFEditorClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <PDFEditor showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
