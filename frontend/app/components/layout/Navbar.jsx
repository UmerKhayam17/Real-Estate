"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getUser, logout } from '@/app/lib/auth';
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  LayoutDashboard,
  Home,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Memoized user fetch
  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
    setIsUserMenuOpen(false);
    router.push('/');
  }, [router]);

  const getDashboardPath = useCallback(() => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'super_admin': return '/super_admin/dashboard';
      case 'dealer': return '/dealer/dashboard';
      default: return '/dashboard';
    }
  }, [user]);

  const getWelcomeMessage = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
    // Implement your dark mode logic here
    document.documentElement.classList.toggle('dark');
  }, []);

  const navigation = [
    { name: 'Properties', href: '/properties', icon: Home },
    { name: 'About', href: '/about', icon: User },
    { name: 'Contact', href: '/contact', icon: Bell },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-4  border-green-800 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto border-4 border-amber-800 px-4 sm:px-6 lg:px-8">
        <div className="flex border-4 border-blue-800 justify-between items-center h-16">
          {/* Left Section - Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">α</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-sky-600 bg-clip-text text-transparent">
                  Alpha Properties
                </span>
                <span className="text-xs text-gray-500 -mt-1">Premium Real Estate</span>
              </div>
            </div>
          </div>

          {/* Center Section - Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search properties, locations, dealers..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Right Section - User Menu & Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-sky-500 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-lg border border-gray-200/60 py-2 z-50 backdrop-blur-xl">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200/60">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role?.replace('_', ' ')}</p>
                      <p className="text-xs text-sky-600 mt-1">{getWelcomeMessage()}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href={getDashboardPath()}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3 text-gray-400 group-hover:text-sky-500" />
                        Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3 text-gray-400 group-hover:text-sky-500" />
                        Profile Settings
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-sky-500" />
                        Preferences
                      </Link>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200/60 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 group"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Login/Signup buttons for non-authenticated users
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/60 shadow-lg"
          ref={mobileMenuRef}
        >
          <div className="px-4 py-3 space-y-1">
            {/* Navigation Links */}
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-3 text-gray-700 hover:text-sky-600 font-medium rounded-lg transition-colors duration-200 hover:bg-sky-50 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-sky-500" />
                  {item.name}
                </Link>
              );
            })}

            {/* User Section for Mobile */}
            {user && (
              <>
                <div className="border-t border-gray-200/60 my-2 pt-2">
                  <Link
                    href={getDashboardPath()}
                    className="flex items-center px-3 py-3 text-gray-700 hover:text-sky-600 font-medium rounded-lg transition-colors duration-200 hover:bg-sky-50 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5 mr-3 text-gray-400 group-hover:text-sky-500" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-3 text-gray-700 hover:text-sky-600 font-medium rounded-lg transition-colors duration-200 hover:bg-sky-50 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-3 text-gray-400 group-hover:text-sky-500" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-3 py-3 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors duration-200 group"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;