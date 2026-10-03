'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const ImagePDFConverter = dynamic(() => import('@/src/components/ImagePDFConverter'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Image & PDF Converter...</div>
});

export default function ImagePDFClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <ImagePDFConverter showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
