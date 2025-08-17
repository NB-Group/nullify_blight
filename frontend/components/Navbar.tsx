'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaUpload, FaGavel, FaTachometerAlt } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="auth-root">
      <nav className={`fixed top-0 left-0 right-0 z-50 navbar-premium ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link 
            href="/" 
            className="text-2xl font-bold heading-premium hover:scale-105 transition-transform duration-300"
          >
            Nullify Blight
          </Link>
          
          <div className="flex items-center space-x-6">
            {isClient ? (
              user ? (
                <>
                  <div className="flex items-center space-x-4">
                  <Link 
                    href="/dashboard" 
                    className="btn-premium flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      background: 'var(--greyLight-1)',
                      color: 'var(--greyDark)',
                      boxShadow: '.2rem .2rem .4rem var(--greyLight-2), -.2rem -.2rem .4rem var(--white)'
                    }}
                  >
                    <FaTachometerAlt size={14} />
                    控制台
                  </Link>
                  
                  <Link 
                    href="/upload" 
                    className="btn-premium flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      background: 'var(--greyLight-1)',
                      color: 'var(--greyDark)',
                      boxShadow: '.2rem .2rem .4rem var(--greyLight-2), -.2rem -.2rem .4rem var(--white)'
                    }}
                  >
                    <FaUpload size={14} />
                    上传论文
                  </Link>
                  
                  <Link 
                    href="/audit" 
                    className="btn-premium flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      background: 'var(--greyLight-1)',
                      color: 'var(--greyDark)',
                      boxShadow: '.2rem .2rem .4rem var(--greyLight-2), -.2rem -.2rem .4rem var(--white)'
                    }}
                  >
                    <FaGavel size={14} />
                    参与审核
                  </Link>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center gap-2 text-premium">
                    <FaUser size={14} />
                    <span className="text-sm font-medium">{user.name || user.email}</span>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="btn-premium flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700"
                    style={{
                      background: 'var(--greyLight-1)',
                      boxShadow: '.2rem .2rem .4rem var(--greyLight-2), -.2rem -.2rem .4rem var(--white)'
                    }}
                  >
                    <FaSignOutAlt size={14} />
                    退出
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth" className="btn-premium flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--greyLight-1)', color: 'var(--greyDark)', boxShadow: '.2rem .2rem .4rem var(--greyLight-2), -.2rem -.2rem .4rem var(--white)' }}>
                  <FaUpload size={14} />
                  上传论文
                </Link>
                <Link href="/auth" className="btn-premium flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--greyLight-1)', color: 'var(--greyDark)', boxShadow: '.2rem .2rem .4rem var(--greyLight-2), -.2rem -.2rem .4rem var(--white)' }}>
                  <FaGavel size={14} />
                  参与审核
                </Link>
                <Link 
                  href="/auth" 
                  className="btn-premium px-6 py-2 rounded-lg text-sm font-medium"
                  style={{
                    background: 'var(--primary)',
                    color: 'var(--white)',
                    boxShadow: 'inset .2rem .2rem .5rem var(--primary-light), inset -.2rem -.2rem .5rem var(--primary-dark), .3rem .3rem .6rem var(--greyLight-2), -.2rem -.2rem .5rem var(--white)'
                  }}
                >
                  登录
                </Link>
              </div>
            )
          ) : (
            <div className="flex items-center space-x-4">
              <div 
                className="btn-premium px-6 py-2 rounded-lg text-sm font-medium"
                style={{ visibility: 'hidden' }}
              >
                登录
              </div>
            </div>
          )}
          </div>
        </div>
      </nav>
      
      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
}