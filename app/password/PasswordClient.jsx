'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const PasswordGenerator = dynamic(() => import('@/src/components/PasswordGenerator'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Password Generator...</div>
});

export default function PasswordClient() {
  const router = useRouter();
  const { showToast } = useToast();
  return <PasswordGenerator showToast={showToast} onBackToDashboard={() => router.push('/')} />;
}
