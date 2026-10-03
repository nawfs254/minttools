'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import WorkspaceLoader from '@/app/components/WorkspaceLoader';

const ImagePDFConverter = dynamic(() => import('@/src/components/ImagePDFConverter'), {
  ssr: false,
  loading: () => <WorkspaceLoader title="Image to PDF Converter" />
});

export default function ImagePDFClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <ImagePDFConverter showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
