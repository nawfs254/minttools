'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const DevConverter = dynamic(() => import('@/src/components/DevConverter'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Dev Converter...</div>
});

export default function ConverterClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <DevConverter showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
