import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import Transition from "@/components/Transition";

export const metadata: Metadata = {
  title: "Nullify Blight - 消污除腐",
  description: "致力于构建一个透明、公正的学术环境",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="auth-root bg-[var(--neu-1)] text-[var(--black)]">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
              <Transition>{children}</Transition>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
