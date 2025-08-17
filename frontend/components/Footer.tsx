import { FaGithub, FaTwitter, FaEnvelope, FaHeart, FaShieldAlt, FaUsers } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="glass-effect mt-16 border-t border-white/20">
      <div className="container mx-auto px-6 py-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold heading-premium mb-4">
              Nullify Blight
            </h3>
            <p className="text-premium mb-6 max-w-md">
              致力于构建一个透明、公正的学术环境，通过社区力量维护学术诚信，消除学术不端行为。
            </p>
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-premium p-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'var(--greyLight-1)',
                  boxShadow: '.2rem .2rem .4rem var(--greyLight-2), -.2rem -.2rem .4rem var(--white)'
                }}
              >
                <FaGithub size={20} style={{color: 'var(--greyDark)'}} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-premium p-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'var(--greyLight-1)',
                  boxShadow: '.2rem .2rem .4rem var(--greyLight-2), -.2rem -.2rem .4rem var(--white)'
                }}
              >
                <FaTwitter size={20} style={{color: 'var(--greyDark)'}} />
              </a>
              <a 
                href="mailto:contact@nullifyblight.com" 
                className="btn-premium p-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'var(--greyLight-1)',
                  boxShadow: '.2rem .2rem .4rem var(--greyLight-2), -.2rem -.2rem .4rem var(--white)'
                }}
              >
                <FaEnvelope size={20} style={{color: 'var(--greyDark)'}} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-premium">快速链接</h4>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-premium hover:text-[var(--primary)] transition-colors duration-300">
                  关于我们
                </a>
              </li>
              <li>
                <a href="/guidelines" className="text-premium hover:text-[var(--primary)] transition-colors duration-300">
                  审核指南
                </a>
              </li>
              <li>
                <a href="/faq" className="text-premium hover:text-[var(--primary)] transition-colors duration-300">
                  常见问题
                </a>
              </li>
              <li>
                <a href="/contact" className="text-premium hover:text-[var(--primary)] transition-colors duration-300">
                  联系我们
                </a>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-premium">法律条款</h4>
            <ul className="space-y-3">
              <li>
                <a href="/privacy" className="text-premium hover:text-[var(--primary)] transition-colors duration-300">
                  隐私政策
                </a>
              </li>
              <li>
                <a href="/terms" className="text-premium hover:text-[var(--primary)] transition-colors duration-300">
                  服务条款
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-premium hover:text-[var(--primary)] transition-colors duration-300">
                  Cookie 政策
                </a>
              </li>
              <li>
                <a href="/disclaimer" className="text-premium hover:text-[var(--primary)] transition-colors duration-300">
                  免责声明
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaShieldAlt className="text-xl" style={{color: 'var(--primary)'}} />
              <span className="text-2xl font-bold text-premium">99.8%</span>
            </div>
            <p className="text-sm text-premium">平台安全性</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaUsers className="text-xl" style={{color: 'var(--primary)'}} />
              <span className="text-2xl font-bold text-premium">10K+</span>
            </div>
            <p className="text-sm text-premium">活跃用户</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaHeart className="text-xl" style={{color: 'var(--primary)'}} />
              <span className="text-2xl font-bold text-premium">24/7</span>
            </div>
            <p className="text-sm text-premium">社区支持</p>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-premium mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Nullify Blight（消污除腐）. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-premium">
            <span>Made with</span>
            <FaHeart className="text-red-500 animate-pulse" />
            <span>for academic integrity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;