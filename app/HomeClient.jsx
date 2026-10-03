'use client';
import { useRouter } from 'next/navigation';
import HomeDashboard from '@/src/components/HomeDashboard';

export default function HomeClient() {
  const router = useRouter();
  return <HomeDashboard onSelectTool={(toolId) => router.push('/' + toolId)} />;
}
