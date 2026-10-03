'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const DevTools = dynamic(() => import('@/src/components/DevTools'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Dev Tools...</div>
});

export default function DevClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <DevTools showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
