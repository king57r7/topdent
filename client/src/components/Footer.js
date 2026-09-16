'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { FiMail, FiPhone } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-secondary-100">
      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">TopDent</h3>
            <p className="text-secondary-400 mb-6 leading-relaxed">
              منصة متخصصة بيع وشراء أدوات ومنتجات ومستلزمات طب الأسنان، تربط بين الزبائن والتجار والعيادات.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 hover:bg-primary-600 rounded-lg transition-colors"><FaFacebook /></a>
              <a href="#" className="p-2 hover:bg-primary-600 rounded-lg transition-colors"><FaInstagram /></a>
              <a href="#" className="p-2 hover:bg-primary-600 rounded-lg transition-colors"><FaTwitter /></a>
              <a href="#" className="p-2 hover:bg-primary-600 rounded-lg transition-colors"><FaWhatsapp /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">الروابط السريعة</h4>
            <nav className="space-y-3">
              <Link href="/products" className="block hover:text-primary-400 transition-colors">جميع المنتجات</Link>
              <Link href="/categories" className="block hover:text-primary-400 transition-colors">الأقسام</Link>
              <Link href="/offers" className="block hover:text-primary-400 transition-colors">العروض والخصومات</Link>
              <Link href="/merchant/register" className="block hover:text-primary-400 transition-colors">أفتح متجرك</Link>
            </nav>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">خدمة العملاء</h4>
            <nav className="space-y-3">
              <Link href="/help" className="block hover:text-primary-400 transition-colors">الدعم والمساعدة</Link>
              <Link href="/faq" className="block hover:text-primary-400 transition-colors">الأسئلة الشائعة</Link>
              <Link href="/return-policy" className="block hover:text-primary-400 transition-colors">سياسة الإرجاع</Link>
              <Link href="/shipping" className="block hover:text-primary-400 transition-colors">معلومات الشحن</Link>
            </nav>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">اتصل بنا</h4>
            <div className="space-y-4">
              <a href="tel:+1234567890" className="flex items-center gap-3 hover:text-primary-400 transition-colors"><FiPhone /><span>+1 234 567 890</span></a>
              <a href="https://wa.me/1234567890" className="flex items-center gap-3 hover:text-primary-400 transition-colors"><FaWhatsapp /><span>WhatsApp</span></a>
              <a href="mailto:info@topdent.com" className="flex items-center gap-3 hover:text-primary-400 transition-colors"><FiMail /><span>info@topdent.com</span></a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h5 className="font-bold text-white mb-3">المعلومات القانونية</h5>
              <div className="space-y-2">
                <Link href="/terms" className="block text-secondary-400 hover:text-primary-400 text-sm">الشروط والأحكام</Link>
                <Link href="/privacy" className="block text-secondary-400 hover:text-primary-400 text-sm">سياسة الخصوصية</Link>
                <Link href="/cookies" className="block text-secondary-400 hover:text-primary-400 text-sm">سياسة ملفات الارتباط</Link>
              </div>
            </div>
            <div>
              <h5 className="font-bold text-white mb-3">للعاملين</h5>
              <div className="space-y-2">
                <Link href="/careers" className="block text-secondary-400 hover:text-primary-400 text-sm">فرص العمل</Link>
                <Link href="/blog" className="block text-secondary-400 hover:text-primary-400 text-sm">المدونة</Link>
                <Link href="/press" className="block text-secondary-400 hover:text-primary-400 text-sm">الإعلام</Link>
              </div>
            </div>
            <div>
              <h5 className="font-bold text-white mb-3">التطبيق</h5>
              <div className="space-y-2">
                <p className="text-secondary-400 text-sm">حمّل التطبيق على جهازك:</p>
                <div className="flex gap-2">
                  <button className="px-3 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-medium transition-colors">iOS</button>
                  <button className="px-3 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-medium transition-colors">Android</button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center border-t border-secondary-700 pt-8">
            <p className="text-secondary-400 text-sm">جميع الحقوق محفوظة © {year} TopDent. جميع الحقوق محفوظة.</p>
            <p className="text-secondary-500 text-xs mt-2">صُمم بكل ❤️ من قبل فريق TopDent</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
