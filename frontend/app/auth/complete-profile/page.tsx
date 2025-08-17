'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CompleteProfilePage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);
    } else {
      router.replace('/auth');
    }
  }, [searchParams, login, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('请输入用户名');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:3000/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        throw new Error('更新用户名失败');
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-pane" style={{ position: 'relative', left: 'auto', right: 'auto', margin: '0 auto' }}>
            <form className="auth-form" onSubmit={handleSubmit}>
              <h2 className="auth-title">Complete Your Profile</h2>
              <span className="auth-sub">Please choose a display name</span>
              
              <input 
                className="auth-input" 
                type="text" 
                placeholder="Enter your display name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                autoFocus
              />
              
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Complete Setup'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
