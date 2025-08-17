'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

// Assuming these types are defined somewhere central, e.g., types/index.ts
interface Comment {
  id: number;
  content: string;
  isError: boolean;
  author: {
    name: string | null;
    email: string;
  };
}

interface CommentSectionProps {
  initialComments: Comment[];
  paperId: number;
}

export default function CommentSection({
  initialComments,
  paperId,
}: CommentSectionProps) {
  const { user, token } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('您需要登录才能发表评论。');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment,
          isError,
          paperId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '评论失败，请稍后再试。');
      }

      const createdComment = await res.json();
      
      // Add the new comment to the list for optimistic update
      setComments([...comments, { ...createdComment, author: { name: user!.name, email: user!.email } }]);
      setNewComment('');
      setIsError(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="space-y-4 mb-8">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-800 p-4 rounded-lg">
            <p>{comment.content}</p>
            <div className="text-sm text-gray-400 mt-2 flex justify-between">
              <span>By: {comment.author.name || comment.author.email}</span>
              {comment.isError && (
                <span className="font-bold text-red-500">标记为错误</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {user ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"
            placeholder="写下你的评论或勘误..."
            rows={4}
            required
          ></textarea>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isError"
                checked={isError}
                onChange={(e) => setIsError(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="isError" className="ml-2 text-sm font-medium">
                将此条标记为论文错误
              </label>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              提交
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      ) : (
        <p className="text-center text-gray-400">
          请 <a href="/login" className="underline">登录</a> 后发表评论。
        </p>
      )}
    </div>
  );
}
