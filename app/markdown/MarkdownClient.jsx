'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import WorkspaceLoader from '@/app/components/WorkspaceLoader';

const MarkdownEditor = dynamic(() => import('@/src/components/MarkdownEditor'), {
  ssr: false,
  loading: () => <WorkspaceLoader title="Markdown Editor" />
});

export default function MarkdownClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <MarkdownEditor showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
