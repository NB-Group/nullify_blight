'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  );
  const [message, setMessage] = useState('正在验证您的邮箱地址...');
  const params = useParams();
  const token = params.token as string;

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/auth/verify-email?token=${token}`
          );
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || '验证失败，请稍后再试。');
          }

          setStatus('success');
          setMessage('邮箱验证成功！您现在可以登录了。');
        } catch (err: any) {
          setStatus('error');
          setMessage(err.message);
        }
      };

      verifyToken();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-white tracking-wider">
          邮箱验证
        </h1>
        <p
          className={`text-lg ${
            status === 'success' ? 'text-green-400' : ''
          } ${status === 'error' ? 'text-red-400' : 'text-gray-300'}`}
        >
          {message}
        </p>

        {status !== 'verifying' && (
          <div className="pt-4">
            <Link
              href="/login"
              className="w-full inline-block px-4 py-3 text-lg font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-transform transform hover:scale-105 duration-300"
            >
              前往登录页面
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
