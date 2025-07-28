'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, UseSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function Home() {
  const router = useRouter();
  const token = useSelector((state:RootState)=>state.auth.token)

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [token,router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}