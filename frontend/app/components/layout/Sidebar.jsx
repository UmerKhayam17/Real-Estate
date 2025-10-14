"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const user = getUser();
    const [isMounted, setIsMounted] = useState(false);

    // This ensures we only render after component mounts (client-side)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Don't render anything during SSR to avoid hydration mismatch
    if (!isMounted) {
        return (
            <div className="bg-white shadow-xl border-r border-gray-200 w-64 h-full">
                {/* Loading skeleton or empty state */}
                <div className="animate-pulse p-4">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const navigation = {
        admin: [
            { name: 'Dashboard', href: `/${user.role}/dashboard`, icon: '📊' },
            { name: 'User Management', href: `/${user.role}/users`, icon: '👥' },
            { name: 'Dealer Management', href: `/${user.role}/dealers`, icon: '🏢' },
            { name: 'Pending Approvals', href: `/${user.role}/pending-approvals`, icon: '⏳' },
            { name: 'Properties', href: `/${user.role}/properties`, icon: '🏠' },
            { name: 'Bookings', href: `/${user.role}/bookings`, icon: '📅' },
            { name: 'Analytics', href: `/${user.role}/analytics`, icon: '📈' },
            { name: 'System Settings', href: `/${user.role}/settings`, icon: '⚙️' },
        ],
        dealer: [
            { name: 'Dashboard', href: `/${user.role}/dashboard`, icon: '📊' },
            { name: 'Properties', href: `/${user.role}/properties`, icon: '🏠' },
            { name: 'Bookings', href: `/${user.role}/bookings`, icon: '📅' },
            { name: 'Find Agents', href: `/${user.role}/findAgent`, icon: '📅' },
            { name: 'Profile', href: `/${user.role}/profile`, icon: '👤' },
        ],
        user: [
            { name: 'Dashboard', href: '/dashboard', icon: '📊' },
            { name: 'Properties', href: '/properties', icon: '🏠' },
            { name: 'Bookings', href: '/bookings', icon: '📅' },
            { name: 'Profile', href: '/profile', icon: '👤' },
        ]
    };

    const menuItems = navigation[user.role] || [];

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className={`bg-white shadow-xl border-r border-gray-200 transition-all duration-300 flex flex-col h-full ${
            isCollapsed ? 'w-16' : 'w-64'
        }`}>
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${
                            pathname === item.href
                                ? 'bg-gradient-to-l from-sky-50 to-sky-25 text-sky-600 border-r-4 border-sky-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                        }`}
                        title={isCollapsed ? item.name : ''}
                    >
                        <span className={`text-xl transition-transform duration-200 ${
                            pathname === item.href ? 'scale-110' : 'group-hover:scale-105'
                        }`}>
                            {item.icon}
                        </span>
                        {!isCollapsed && (
                            <span className="font-medium transition-all duration-200">
                                {item.name}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

        </div>
    );
};

export default Sidebar;