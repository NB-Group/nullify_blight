'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FaFileUpload, FaFilePdf, FaTimes, FaPaperPlane, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const router = useRouter();
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('文件大小不能超过10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('请选择要上传的文件。');
      return;
    }
    if (!token) {
      setError('您需要登录才能上传论文。');
      router.push('/auth');
      return;
    }
    setError('');
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:3001/paper', true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };
    
    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadComplete(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          setError(errorData.message || '上传失败，请稍后再试。');
        } catch {
          setError('上传失败，请稍后再试。');
        }
      }
    };
    
    xhr.onerror = () => {
      setIsUploading(false);
      setError('上传时发生网络错误。');
    };
    
    xhr.send(formData);
  };

  if (uploadComplete) {
    return (
      <div className="auth-root">
        <div className="auth-wrapper">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="auth-card text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'var(--primary)',
                boxShadow: 'inset .2rem .2rem .5rem var(--primary-light), inset -.2rem -.2rem .5rem var(--primary-dark), .3rem .3rem .6rem var(--greyLight-2), -.2rem -.2rem .5rem var(--white)'
              }}
            >
              <FaCheck className="text-white text-3xl" />
            </motion.div>
            <h2 className="auth-title">上传成功！</h2>
            <p className="auth-sub mb-6">您的论文已成功提交，正在跳转到仪表盘...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full"
                style={{ background: 'var(--primary)' }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-root">
      <div className="min-h-screen p-8" style={{ background: 'var(--greyLight-1)' }}>
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold heading-premium mb-4"
              >
                上传论文
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-premium text-lg"
              >
                社区成员共同审查
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-premium shadow-premium-hover p-8 rounded-3xl"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-lg font-semibold text-premium">
                    论文标题
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="auth-input w-full"
                    placeholder="例如：基于深度学习的医学影像分析算法研究"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="abstract" className="block text-lg font-semibold text-premium">
                    问题简介
                  </label>
                  <textarea
                    id="abstract"
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    className="auth-input w-full resize-none"
                    placeholder="请描述该论文存在的已知问题，例如学术造假、数据篡改、不当引用、重复发表、未提供源数据、未遵循透明度原则、知识产权问题等。"
                    rows={8}
                    required
                    style={{ height: 'auto', minHeight: '200px' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-lg font-semibold text-premium">
                    上传文件
                  </label>
                  <AnimatePresence>
                    {file ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative p-6 rounded-xl"
                        style={{
                          background: 'var(--greyLight-1)',
                          boxShadow: 'inset .2rem .2rem .5rem var(--greyLight-2), inset -.2rem -.2rem .5rem var(--white)'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="w-12 h-12 rounded-lg flex items-center justify-center"
                              style={{
                                background: 'var(--primary)',
                                boxShadow: '.2rem .2rem .4rem var(--greyLight-2), -.2rem -.2rem .4rem var(--white)'
                              }}
                            >
                              <FaFilePdf className="text-white text-xl" />
                            </div>
                            <div>
                              <p className="font-semibold text-premium">{file.name}</p>
                              <p className="text-sm" style={{ color: 'var(--greyDark)' }}>
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                            style={{
                              background: 'var(--greyLight-1)',
                              boxShadow: '.2rem .2rem .4rem var(--greyLight-2), -.2rem -.2rem .4rem var(--white)'
                            }}
                          >
                            <FaTimes className="text-gray-600" />
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-12 text-center cursor-pointer rounded-xl transition-all duration-300 ${
                          isDragOver ? 'transform scale-105' : ''
                        }`}
                        style={{
                          background: 'var(--greyLight-1)',
                          boxShadow: isDragOver 
                            ? 'inset .3rem .3rem .6rem var(--greyLight-2), inset -.3rem -.3rem .6rem var(--white)'
                            : '.3rem .3rem .6rem var(--greyLight-2), -.2rem -.2rem .5rem var(--white)'
                        }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                          accept=".pdf"
                        />
                        <motion.div
                          animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <FaFileUpload className="mx-auto text-4xl mb-4" style={{ color: 'var(--greyDark)' }} />
                        </motion.div>
                        <p className="text-xl font-semibold mb-2 text-premium">
                          {isDragOver ? '松开以上传文件' : '拖拽文件至此或点击上传'}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--greyDark)' }}>
                          支持 PDF 格式，最大 10MB
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl text-center"
                    style={{
                      background: 'var(--greyLight-1)',
                      boxShadow: 'inset .2rem .2rem .5rem var(--greyLight-2), inset -.2rem -.2rem .5rem var(--white)',
                      color: '#ef4444'
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                {isUploading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-premium">上传进度</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>{uploadProgress}%</span>
                    </div>
                    <div 
                      className="w-full rounded-full h-3 overflow-hidden"
                      style={{
                        background: 'var(--greyLight-1)',
                        boxShadow: 'inset .2rem .2rem .5rem var(--greyLight-2), inset -.2rem -.2rem .5rem var(--white)'
                      }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'var(--primary)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isUploading || !title.trim() || !abstract.trim() || !file}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn btn__primary btn-premium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane className="text-lg" />
                  <span>{isUploading ? '正在提交...' : '提交审核'}</span>
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}