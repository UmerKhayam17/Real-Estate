"use client";
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] z-30">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-lg"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-64 h-full">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden fixed top-20 left-4 z-30 p-2 bg-white shadow-lg rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="p-6 pt-20 lg:pt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}