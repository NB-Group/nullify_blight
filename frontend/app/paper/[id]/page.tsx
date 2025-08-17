'use client';

import { useState, useEffect } from 'react';
import CommentSection from '@/components/CommentSection';
import Modal from '@/components/Modal';

// Assuming types are defined centrally
interface Paper {
  id: string;
  title: string;
  abstract: string;
  comments: any[]; // You might want to define a Comment type as well
}

interface Evidence {
  id: string;
  content: string;
}

interface ErrorComment {
  id: string;
  text: string;
}

interface ReportPackage {
  paper: Paper;
  evidences: Evidence[];
  errorComments: ErrorComment[];
}

async function getPaperDetails(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/paper/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch paper details');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function PaperDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [paper, setPaper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportPackage, setReportPackage] = useState<ReportPackage | null>(
    null,
  );

  useEffect(() => {
    getPaperDetails(params.id).then(setPaper);
  }, [params.id]);

  const handleReportClick = async () => {
    setIsModalOpen(true);
    try {
      const res = await fetch(
        `http://localhost:3000/paper/${params.id}/report-package`,
      );
      if (!res.ok) throw new Error('Failed to fetch report package');
      const data = await res.json();
      setReportPackage(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!paper) {
    return <div className="text-center">正在加载论文...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-start">
        <h1 className="text-4xl font-bold mb-4">{paper.title}</h1>
        <button
          onClick={handleReportClick}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          一键举报
        </button>
      </div>

      <p className="text-gray-400 mb-8">{paper.abstract}</p>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">评论与勘误</h2>
        <CommentSection initialComments={paper.comments} paperId={paper.id} />
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">相关证据</h2>
        {/* We can map evidences here similarly */}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="举报证据汇总"
      >
        {reportPackage ? (
          <div>
            <h3 className="text-xl font-bold mb-2">核心论文信息</h3>
            <p>{reportPackage.paper.title}</p>
            
            <h3 className="text-xl font-bold mt-6 mb-2">已审核证据</h3>
            {/* Map through reportPackage.evidences */}

            <h3 className="text-xl font-bold mt-6 mb-2">关键勘误评论</h3>
            {/* Map through reportPackage.errorComments */}

            <a href="https://www.nsfc.gov.cn/" target="_blank" rel="noopener noreferrer" className="block w-full text-center mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">
                跳转至国家自然科学基金委员会官网进行举报
            </a>
          </div>
        ) : (
          <p>正在加载证据链...</p>
        )}
      </Modal>
    </div>
  );
}
