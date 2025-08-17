'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  FaUpload, 
  FaGavel, 
  FaFileAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaTrophy,
  FaStar
} from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';

interface DashboardStats {
  papersUploaded: number;
  papersApproved: number;
  papersRejected: number;
  papersPending: number;
  auditsCompleted: number;
  auditAccuracy: number;
}

interface RecentActivity {
  id: number;
  type: 'upload' | 'audit' | 'approval' | 'rejection';
  title: string;
  timestamp: string;
}

interface RawActivity {
  id: number;
  status: 'APPROVED' | 'REJECTED' | 'PENDING' | string; 
  title: string;
  timestamp: string;
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const res = await fetch('http://127.0.0.1:3001/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('无法获取仪表盘数据');
          const data = await res.json();
          setStats(data.stats);
          setRecentActivities(
            data.recentActivities.map((a: RawActivity) => ({
              id: a.id,
              type: a.status === 'APPROVED' ? 'approval' : a.status === 'REJECTED' ? 'rejection' : 'upload',
              title: a.title,
              timestamp: new Date(a.timestamp).toLocaleString(),
            }))
          );
        } catch (error) {
          console.error('Failed to fetch dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <FaUpload className="text-blue-500" />;
      case 'audit': return <FaGavel className="text-purple-500" />;
      case 'approval': return <FaCheckCircle className="text-green-500" />;
      case 'rejection': return <FaTimesCircle className="text-red-500" />;
      default: return <FaFileAlt className="text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center" style={{background: 'var(--greyLight-1)'}}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen p-8 text-center" style={{background: 'var(--greyLight-1)'}}>
        <p>无法加载仪表盘数据。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{background: 'var(--greyLight-1)'}}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 heading-premium">
            欢迎回来，{user?.name || user?.email}
          </h1>
          <p className="text-lg text-premium">
            这是您的个人学术中心，管理您的论文投稿和审核活动
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link 
            href="/upload"
            className="card-premium shadow-premium-hover p-8 block group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{background: 'var(--primary)'}}>
                <FaUpload className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 heading-premium">上传新论文</h3>
                <p className="text-premium">提交您的学术作品进行社区审核</p>
              </div>
              <div className="ml-auto">
                <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link 
            href="/audit"
            className="card-premium shadow-premium-hover p-8 block group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{background: 'var(--primary)'}}>
                <FaGavel className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 heading-premium">参与审核</h3>
                <p className="text-premium">为学术社区贡献您的专业知识</p>
              </div>
              <div className="ml-auto">
                <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card-premium shadow-premium-hover p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{background: 'var(--primary)'}}>
              <FaFileAlt className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold mb-1 text-premium">{stats.papersUploaded}</h3>
            <p className="text-premium text-sm">已上传论文</p>
          </div>

          <div className="card-premium shadow-premium-hover p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-green-500">
              <FaCheckCircle className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold mb-1 text-premium">{stats.papersApproved}</h3>
            <p className="text-premium text-sm">已通过审核</p>
          </div>

          <div className="card-premium shadow-premium-hover p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-orange-500">
              <FaClock className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold mb-1 text-premium">{stats.papersPending}</h3>
            <p className="text-premium text-sm">审核中</p>
          </div>

          <div className="card-premium shadow-premium-hover p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-purple-500">
              <FaGavel className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold mb-1 text-premium">{stats.auditsCompleted}</h3>
            <p className="text-premium text-sm">完成审核</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="card-premium shadow-premium-hover p-8">
              <h2 className="text-2xl font-bold mb-6 heading-premium">最近活动</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-premium">{activity.title}</p>
                      <p className="text-sm text-premium opacity-75">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements & Stats */}
          <div className="space-y-8">
            
            {/* Achievement Card */}
            <div className="card-premium shadow-premium-hover p-6">
              <h3 className="text-xl font-bold mb-4 heading-premium">成就徽章</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaTrophy className="text-yellow-500 text-xl" />
                  <div>
                    <p className="font-medium text-premium">活跃贡献者</p>
                    <p className="text-xs text-premium opacity-75">完成50次审核</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaStar className="text-blue-500 text-xl" />
                  <div>
                    <p className="font-medium text-premium">质量审核员</p>
                    <p className="text-xs text-premium opacity-75">审核准确率90%+</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Card */}
            <div className="card-premium shadow-premium-hover p-6">
              <h3 className="text-xl font-bold mb-4 heading-premium">审核表现</h3>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-premium">{stats.auditAccuracy}%</div>
                <p className="text-premium text-sm mb-4">准确率</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{
                      width: `${stats.auditAccuracy}%`,
                      background: 'var(--primary)'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
