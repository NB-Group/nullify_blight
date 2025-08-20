'use client';

import Link from 'next/link';

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-white tracking-wider">
          注册成功!
        </h1>
        <p className="text-gray-300 text-lg">
          感谢您的注册。我们已经向您的邮箱发送了一封验证邮件，请点击邮件中的链接以激活您的账户。
        </p>
        <p className="text-gray-400">
          (如果您没有收到邮件，请检查您的垃圾邮件文件夹)
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="w-full inline-block px-4 py-3 text-lg font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-transform transform hover:scale-105 duration-300"
          >
            返回登录页面
          </Link>
        </div>
      </div>
    </div>
  );
}
