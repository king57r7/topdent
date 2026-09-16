import '@/styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'TopDent - منصة متخصصة بأدوات طب الأسنان',
  description: 'منصة إلكترونية متخصصة ببيع وشراء وعرض أدوات ومنتجات ومستلزمات طب الأسنان',
  keywords: ['طب الأسنان', 'أدوات الأسنان', 'منتجات الأسنان', 'e-commerce'],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-white">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
