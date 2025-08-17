'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaCheck, FaTimes, FaSpinner, FaExclamationCircle, FaBookOpen, FaUsers, FaAward } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';

interface AuditTask {
  id: number;
  title: string;
  abstract: string;
}

interface AuditStats {
  communityAuditors: number;
  papersAudited: number;
  auditAccuracy: number;
}

export default function AuditPage() {
  const [task, setTask] = useState<AuditTask | null>(null);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();

  const fetchTask = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch audit task
      const taskRes = await fetch('http://127.0.0.1:3001/audit/task', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (taskRes.status === 404) {
        setTask(null); // No task available, but not an error
      } else if (!taskRes.ok) {
        throw new Error('获取审核任务失败。');
      } else {
        const taskData = await taskRes.json();
        setTask(taskData);
      }

      // Fetch audit stats - assuming a separate endpoint
      // In a real app, this might be combined with the task fetch
      // const statsRes = await fetch('http://127.0.0.1:3001/audit/stats');
      // const statsData = await statsRes.json();
      // setStats(statsData);

      // Mock stats for now
      setStats({
        communityAuditors: 2847,
        papersAudited: 15623,
        auditAccuracy: 94.2,
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAudit = async (decision: boolean) => {
    if (!task) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('http://127.0.0.1:3001/audit/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paperId: task.id,
          decision,
        }),
      });

      if (!res.ok) {
        throw new Error('提交审核失败。');
      }
      
      // 添加成功提示动画
      const successElement = document.createElement('div');
      successElement.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successElement.textContent = decision ? '审核通过已提交' : '审核拒绝已提交';
      document.body.appendChild(successElement);
      
      setTimeout(() => {
        document.body.removeChild(successElement);
        fetchTask();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTask();
    }
  }, [token]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-80">
          <LoadingSpinner />
        </div>
      );
    }
    
    if (error && !task) { // Show error only if there's no task to display
      return (
        <div className="card-premium p-12 text-center">
          <FaExclamationCircle className="text-6xl text-orange-500 mb-6 mx-auto" />
          <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--greyDark)'}}>
            获取失败
          </h3>
          <p className="text-lg mb-6" style={{color: 'var(--greyDark)'}}>{error}</p>
          <button
            onClick={fetchTask}
            className="btn btn__primary btn-premium px-6 py-3"
          >
            重试
          </button>
        </div>
      );
    }
    
    if (task) {
      return (
        <div className="card-premium shadow-premium-hover p-10 transition-all duration-500">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaBookOpen className="text-2xl" style={{color: 'var(--primary)'}} />
              <span className="text-sm font-medium text-premium">审核任务 #{task.id}</span>
            </div>
            <h2 className="text-4xl font-bold mb-6 heading-premium leading-tight">
              {task.title}
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed" style={{color: 'var(--greyDark)'}}>
                {task.abstract}
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <div className="flex justify-center items-center gap-8">
              <button
                onClick={() => submitAudit(true)}
                disabled={isSubmitting}
                className="btn-premium group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 disabled:opacity-50"
                style={{
                  background: '#10b981',
                  color: 'white',
                  boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3), 0 4px 8px rgba(16, 185, 129, 0.2)'
                }}
              >
                <div className="flex items-center gap-3">
                  <FaCheck className="text-xl" />
                  <span>{isSubmitting ? '提交中...' : '通过'}</span>
                </div>
              </button>
              
              <button
                onClick={() => submitAudit(false)}
                disabled={isSubmitting}
                className="btn-premium group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 disabled:opacity-50"
                style={{
                  background: '#ef4444',
                  color: 'white',
                  boxShadow: '0 8px 16px rgba(239, 68, 68, 0.3), 0 4px 8px rgba(239, 68, 68, 0.2)'
                }}
              >
                <div className="flex items-center gap-3">
                  <FaTimes className="text-xl" />
                  <span>{isSubmitting ? '提交中...' : '拒绝'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // No task and no error message means no tasks are available
    return (
      <div className="card-premium p-12 text-center">
        <FaExclamationCircle className="text-6xl text-orange-500 mb-6 mx-auto" />
        <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--greyDark)'}}>
          暂无审核任务
        </h3>
        <p className="text-lg mb-6" style={{color: 'var(--greyDark)'}}>
          当前没有可供您审核的任务。感谢您的参与！
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8" style={{background: 'var(--greyLight-1)'}}>
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 floating">
          <h1 className="text-5xl font-bold mb-4 heading-premium">
            社区审核
          </h1>
          <p className="text-lg text-premium max-w-3xl mx-auto mb-8">
            参与学术论文的同行评议，帮助维护学术诚信，共同构建健康的学术生态环境
          </p>
          
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="card-premium p-6 text-center">
                <FaUsers className="text-3xl mx-auto mb-3" style={{color: 'var(--primary)'}} />
                <h3 className="text-lg font-semibold mb-1" style={{color: 'var(--greyDark)'}}>社区审核员</h3>
                <p className="text-2xl font-bold text-premium">{stats.communityAuditors.toLocaleString()}</p>
              </div>
              <div className="card-premium p-6 text-center">
                <FaBookOpen className="text-3xl mx-auto mb-3" style={{color: 'var(--primary)'}} />
                <h3 className="text-lg font-semibold mb-1" style={{color: 'var(--greyDark)'}}>已审核论文</h3>
                <p className="text-2xl font-bold text-premium">{stats.papersAudited.toLocaleString()}</p>
              </div>
              <div className="card-premium p-6 text-center">
                <FaAward className="text-3xl mx-auto mb-3" style={{color: 'var(--primary)'}} />
                <h3 className="text-lg font-semibold mb-1" style={{color: 'var(--greyDark)'}}>审核准确率</h3>
                <p className="text-2xl font-bold text-premium">{stats.auditAccuracy}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  );
}