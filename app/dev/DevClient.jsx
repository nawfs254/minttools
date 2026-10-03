'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import WorkspaceLoader from '@/app/components/WorkspaceLoader';

const DevTools = dynamic(() => import('@/src/components/DevTools'), {
  ssr: false,
  loading: () => <WorkspaceLoader title="Dev & Text Utilities" />
});

export default function DevClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <DevTools showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
