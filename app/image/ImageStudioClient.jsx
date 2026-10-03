'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import WorkspaceLoader from '@/app/components/WorkspaceLoader';

const ImageStudio = dynamic(() => import('@/src/components/ImageStudio'), {
  ssr: false,
  loading: () => <WorkspaceLoader title="Image Studio" />
});

export default function ImageStudioClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <ImageStudio showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
