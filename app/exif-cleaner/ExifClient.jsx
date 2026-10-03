'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import WorkspaceLoader from '@/app/components/WorkspaceLoader';

const ExifCleaner = dynamic(() => import('@/src/components/ExifCleaner'), {
  ssr: false,
  loading: () => <WorkspaceLoader title="EXIF Metadata Cleaner" />
});

export default function ExifClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <ExifCleaner showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
