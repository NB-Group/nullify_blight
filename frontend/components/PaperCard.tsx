import Link from 'next/link';
import { FaUser, FaCalendar, FaEye, FaFileAlt } from 'react-icons/fa';

interface Paper {
  id: number;
  title: string;
  abstract: string;
  uploader: {
    name: string;
  };
  createdAt?: string;
}

const PaperCard = ({ paper }: { paper: Paper }) => {
  return (
    <div className="card-premium shadow-premium-hover bg-[var(--greyLight-1)] rounded-2xl p-8 group">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background: 'var(--primary)'}}>
          <FaFileAlt className="text-white text-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold heading-premium mb-2 line-clamp-2 leading-tight">
            {paper.title}
          </h2>
          <div className="flex items-center gap-4 text-sm text-premium">
            <div className="flex items-center gap-1">
              <FaUser size={12} />
              <span>{paper.uploader?.name || '匿名'}</span>
            </div>
            {paper.createdAt && (
              <div className="flex items-center gap-1">
                <FaCalendar size={12} />
                <span>{new Date(paper.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Abstract */}
      <div className="mb-6">
        <p className="text-premium leading-relaxed line-clamp-4">
          {paper.abstract}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-1 text-sm text-premium">
          <FaEye size={12} />
          <span>已审核</span>
        </div>
        
        <Link 
          href={`/paper/${paper.id}`} 
          className="btn-premium flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
          style={{
            background: 'var(--primary)',
            color: 'white',
            boxShadow: '0 4px 8px rgba(109, 93, 252, 0.3)'
          }}
        >
          <span>查看详情</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default PaperCard;