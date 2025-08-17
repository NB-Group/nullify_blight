'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Turnstile from 'react-turnstile';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  // Handle OAuth callback and errors
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');
    
    if (token) {
      login(token);
      router.replace('/');
    } else if (error === 'oauth_failed') {
      setError('GitHub 登录失败，请检查网络连接后重试。');
    }
  }, [login, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      // Registration validation
      if (password !== confirmPassword) {
        setError('两次输入的密码不匹配。');
        return;
      }
      if (!captchaToken) {
        setError('请先完成人机验证。');
        return;
      }
    }

    try {
      const endpoint = isLogin ? '/auth/signin' : '/auth/signup';
      const body = isLogin 
        ? { email, password, captchaToken: captchaToken || 'not-required-for-login' }
        : { email, password, name: name || undefined, captchaToken };

      const res = await fetch(`http://127.0.0.1:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || (isLogin ? '登录失败' : '注册失败'));
      }

      if (isLogin) {
        const data = await res.json();
        login(data.access_token);
        router.push('/');
      } else {
        router.push('/signup/success');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    // Do not reset captchaToken, let it persist
  };

  return (
    <div className="auth-root">
      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Animated switch panel */}
          <div className={`auth-switch ${isLogin ? 'is-login' : ''}`}>
            <div className="auth-switch-circle"></div>
            <div className="auth-switch-circle auth-switch-circle--t"></div>
            
            <div className={`auth-switch-content ${isLogin ? 'is-hidden' : ''}`}>
              <h2 className="auth-title">欢迎回来!</h2>
              <p className="auth-sub">为了与我们保持联系，请使用您的个人信息登录</p>
              <button className="auth-button" onClick={toggleMode}>登录</button>
            </div>
            
            <div className={`auth-switch-content ${!isLogin ? 'is-hidden' : ''}`}>
              <h2 className="auth-title">你好, 朋友!</h2>
              <p className="auth-sub">输入您的个人详细信息，开始我们的旅程</p>
              <button className="auth-button" onClick={toggleMode}>注册</button>
            </div>
          </div>

          {/* Forms container */}
          <div className={`auth-forms-container ${isLogin ? 'is-login' : ''}`}>
            {/* Sign up form */}
            <div className={`auth-pane signup-pane ${isLogin ? 'is-hidden' : ''}`}>
              <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">创建账户</h2>
                <span className="auth-sub">使用您的邮箱进行注册</span>
                
                <input 
                  className="auth-input" 
                  type="text" 
                  placeholder="用户名 (可选)" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
                <input 
                  className="auth-input" 
                  type="email" 
                  placeholder="电子邮箱" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <input 
                  className="auth-input" 
                  type="password" 
                  placeholder="密码" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <input 
                  className="auth-input" 
                  type="password" 
                  placeholder="确认密码" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
                
                <button type="submit" className="auth-button">注册</button>
                <div className="auth-sep" />
                <a
                  href="http://127.0.0.1:3001/auth/github"
                  className="auth-button flex items-center justify-center gap-2"
                  style={{background: 'var(--greyDark)', color: 'var(--white)', marginTop: '-35px'}}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"></path>
                  </svg>
                  GitHub 注册
                </a>
              </form>
            </div>

            {/* Sign in form */}
            <div className={`auth-pane signin-pane ${!isLogin ? 'is-hidden' : ''}`}>
              <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">登录</h2>
                <span className="auth-sub">使用您的邮箱账户登录</span>
                
                <input 
                  className="auth-input" 
                  type="email" 
                  placeholder="电子邮箱" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <input 
                  className="auth-input" 
                  type="password" 
                  placeholder="密码" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                
                <a className="auth-link">忘记密码?</a>
                <button type="submit" className="auth-button">登录</button>
                
                <div className="auth-sep" />
                <a
                  href="http://127.0.0.1:3001/auth/github"
                  className="auth-button flex items-center justify-center gap-2"
                  style={{background: 'var(--greyDark)', color: 'var(--white)', marginTop: '-35px'}}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"></path>
                  </svg>
                  GitHub 登录
                </a>
              </form>
            </div>
          </div>
          
          {/* Turnstile is always rendered but might be visually hidden or positioned off-screen */}
          <div style={{ position: 'absolute', bottom: isLogin ? '-100px' : 'calc(50% - 160px)', right: '115px', transition: 'all 0.5s' }}>
             <Turnstile sitekey="0x4AAAAAABsQxqZZTVebXj7i" onVerify={(token) => setCaptchaToken(token)} />
          </div>

          {error && (
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: 'red' }}>
                {error}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
