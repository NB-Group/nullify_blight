import PaperCard from '@/components/PaperCard';
import { FaRocket, FaShieldAlt, FaUsers, FaChartLine, FaBookOpen, FaAward } from 'react-icons/fa';

interface Paper {
  id: number;
  title: string;
  abstract: string;
  uploader: {
    name: string;
  };
  createdAt?: string;
}

async function getPapers(): Promise<Paper[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paper`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('Failed to fetch papers, status:', res.status);
      return [];
    }
    const data: Paper[] = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export default async function HomePage() {
  const papers = await getPapers();

  return (
    <div className="page-enter page-enter-active">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="floating">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 heading-premium">
              Nullify Blight
            </h1>
            <p className="text-2xl md:text-3xl font-light mb-8 text-premium max-w-4xl mx-auto">
              消污除腐，构建透明公正的学术环境
            </p>
            <p className="text-lg mb-12 text-premium max-w-3xl mx-auto leading-relaxed">
              通过社区力量和先进技术，我们致力于维护学术诚信，打击学术不端行为，
              为全球学术界提供一个值得信赖的平台。
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a 
              href="/upload" 
              className="btn btn__primary btn-premium flex items-center gap-3 px-8 py-4 text-lg font-semibold"
            >
              <FaRocket />
              上传论文
            </a>
            <a 
              href="/audit" 
              className="btn btn__secondary btn-premium flex items-center gap-3 px-8 py-4 text-lg font-semibold"
            >
              <FaShieldAlt />
              参与审核
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="card-premium shadow-premium-hover p-8 text-center">
              <FaBookOpen className="text-4xl mx-auto mb-4" style={{color: 'var(--primary)'}} />
              <h3 className="text-3xl font-bold mb-2 text-premium">15,623</h3>
              <p className="text-premium">已审核论文</p>
            </div>
            <div className="card-premium shadow-premium-hover p-8 text-center">
              <FaUsers className="text-4xl mx-auto mb-4" style={{color: 'var(--primary)'}} />
              <h3 className="text-3xl font-bold mb-2 text-premium">2,847</h3>
              <p className="text-premium">活跃审核员</p>
            </div>
            <div className="card-premium shadow-premium-hover p-8 text-center">
              <FaChartLine className="text-4xl mx-auto mb-4" style={{color: 'var(--primary)'}} />
              <h3 className="text-3xl font-bold mb-2 text-premium">94.2%</h3>
              <p className="text-premium">审核准确率</p>
            </div>
            <div className="card-premium shadow-premium-hover p-8 text-center">
              <FaAward className="text-4xl mx-auto mb-4" style={{color: 'var(--primary)'}} />
              <h3 className="text-3xl font-bold mb-2 text-premium">99.8%</h3>
              <p className="text-premium">用户满意度</p>
            </div>
          </div>
        </div>
      </section>

      {/* Papers Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 heading-premium">
              公开论文库
            </h2>
            <p className="text-lg text-premium max-w-3xl mx-auto">
              经过社区审核的高质量学术论文，为学术研究提供可靠的参考资源
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {papers.length > 0 ? (
              papers.map((paper: Paper) => <PaperCard key={paper.id} paper={paper} />)
            ) : (
              <div className="col-span-full">
                <div className="card-premium shadow-premium-hover p-16 text-center">
                  <FaBookOpen className="text-6xl mx-auto mb-6" style={{color: 'var(--greyLight-3)'}} />
                  <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--greyDark)'}}>
                    暂无已审核的公开论文
                  </h3>
                  <p className="text-lg mb-8" style={{color: 'var(--greyDark)'}}>
                    成为第一个上传论文的用户，为学术社区贡献力量
                  </p>
                  <a 
                    href="/upload" 
                    className="btn btn__primary btn-premium inline-flex items-center gap-2 px-6 py-3"
                  >
                    <FaRocket />
                    立即上传
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 heading-premium">
              为什么选择我们
            </h2>
            <p className="text-lg text-premium max-w-3xl mx-auto">
              我们提供最先进的学术诚信保障服务，确保每一篇论文都经过严格的同行评议
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-premium shadow-premium-hover p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{background: 'var(--primary)'}}>
                <FaShieldAlt className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 heading-premium">严格审核</h3>
              <p className="text-premium leading-relaxed">
                多重审核机制，确保每篇论文都经过专业同行的严格评议，维护学术质量标准。
              </p>
            </div>
            
            <div className="card-premium shadow-premium-hover p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{background: 'var(--primary)'}}>
                <FaUsers className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 heading-premium">社区驱动</h3>
              <p className="text-premium leading-relaxed">
                汇聚全球学者智慧，通过集体力量识别和防范学术不端行为，共建诚信环境。
              </p>
            </div>
            
            <div className="card-premium shadow-premium-hover p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{background: 'var(--primary)'}}>
                <FaChartLine className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 heading-premium">持续改进</h3>
              <p className="text-premium leading-relaxed">
                基于数据驱动的持续优化，不断提升审核效率和准确性，为用户提供更好体验。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}