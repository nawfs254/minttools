'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import WorkspaceLoader from '@/app/components/WorkspaceLoader';

const DevConverter = dynamic(() => import('@/src/components/DevConverter'), {
  ssr: false,
  loading: () => <WorkspaceLoader title="Developer Converter" />
});

export default function ConverterClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <DevConverter showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
