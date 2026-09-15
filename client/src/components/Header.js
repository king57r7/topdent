'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiSearch, FiShoppingCart, FiHeart, FiBell, FiUser, FiChevronDown } from 'react-icons/fi';
import SearchBar from './SearchBar';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount] = useState(0);
  const [notificationsCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-secondary-100 shadow-sm">
      {/* Top bar */}
      <div className="hidden md:block bg-secondary-50 border-b border-secondary-100">
        <div className="container-main py-2 flex justify-between items-center text-sm text-secondary-600">
          <div className="flex gap-6">
            <Link href="/help" className="hover:text-primary-600">
              الدعم والمساعدة
            </Link>
            <Link href="/about" className="hover:text-primary-600">
              عن الموقع
            </Link>
            <Link href="/contact" className="hover:text-primary-600">
              تواصل معنا
            </Link>
          </div>
          <div>مرحباً بك في TopDent</div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-main py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="text-3xl font-bold text-primary-600 group-hover:text-primary-700 transition-colors">
              T
            </div>
            <span className="hidden sm:inline text-xl font-bold text-secondary-900">TopDent</span>
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden lg:flex flex-1 mx-8">
            <SearchBar />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Search - Mobile */}
            <button className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors">
              <FiSearch className="text-xl text-secondary-700" />
            </button>

            {/* Notifications */}
            <Link href="/notifications" className="relative p-2 hover:bg-secondary-100 rounded-lg transition-colors">
              <FiBell className="text-xl text-secondary-700" />
              {notificationsCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationsCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-secondary-100 rounded-lg transition-colors">
              <FiShoppingCart className="text-xl text-secondary-700" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Favorites */}
            <Link href="/favorites" className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
              <FiHeart className="text-xl text-secondary-700" />
            </Link>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <FiUser className="text-xl text-secondary-700" />
                <FiChevronDown className={`text-secondary-700 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-100 overflow-hidden">
                  <Link href="/auth/login" className="block px-4 py-3 hover:bg-secondary-50 border-b border-secondary-100">
                    تسجيل الدخول
                  </Link>
                  <Link href="/auth/register" className="block px-4 py-3 hover:bg-secondary-50 border-b border-secondary-100">
                    إنشاء حساب
                  </Link>
                  <Link href="/merchant/register" className="block px-4 py-3 hover:bg-secondary-50 text-primary-600 font-medium">
                    أفتح متجرك
                  </Link>
                </div>
              )}
            </div>

            {/* Menu button - Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Search bar - Mobile */}
        <div className="lg:hidden mt-4">
          <SearchBar />
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-secondary-100 bg-white">
          <nav className="container-main py-4 space-y-2">
            <Link href="/products" className="block px-4 py-2 hover:bg-secondary-50 rounded-lg">
              جميع المنتجات
            </Link>
            <Link href="/products?condition=new" className="block px-4 py-2 hover:bg-secondary-50 rounded-lg">
              منتجات جديدة
            </Link>
            <Link href="/products?offers=true" className="block px-4 py-2 hover:bg-secondary-50 rounded-lg">
              العروض والخصومات
            </Link>
            <Link href="/merchant/register" className="block px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg">
              أفتح متجرك
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
