"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import {
    LayoutDashboard,
    Users,
    Building2,
    Crown,
    Clock,
    Home,
    Calendar,
    BarChart3,
    Settings,
    Search,
    User,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';

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
        super_admin: [
            { name: 'Dashboard', href: `/${user.role}/dashboard`, icon: LayoutDashboard },
            { name: 'User Management', href: `/${user.role}/users`, icon: Users },
            { name: 'Dealer Management', href: `/${user.role}/dealers`, icon: Building2 },
            { name: 'Plans', href: `/${user.role}/plan`, icon: Crown },
            { name: 'Pending Approvals', href: `/${user.role}/pending-approvals`, icon: Clock },
            { name: 'Properties', href: `/${user.role}/properties`, icon: Home },
            { name: 'Bookings', href: `/${user.role}/bookings`, icon: Calendar },
            { name: 'Analytics', href: `/${user.role}/analytics`, icon: BarChart3 },
            { name: 'System Settings', href: `/${user.role}/settings`, icon: Settings },
        ],
        dealer: [
            { name: 'Dashboard', href: `/${user.role}/dashboard`, icon: LayoutDashboard },
            { name: 'Properties', href: `/${user.role}/properties`, icon: Home },
            { name: 'Bookings', href: `/${user.role}/bookings`, icon: Calendar },
            { name: 'Find Agents', href: `/${user.role}/findAgent`, icon: Search },
            { name: 'Profile', href: `/${user.role}/profile`, icon: User },
        ],
        user: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Properties', href: '/properties', icon: Home },
            { name: 'Bookings', href: '/bookings', icon: Calendar },
            { name: 'Profile', href: '/profile', icon: User },
        ]
    };

    const menuItems = navigation[user.role] || [];

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className={`bg-white shadow-xl border-r border-gray-200 transition-all duration-300 flex flex-col h-full ${isCollapsed ? 'w-16' : 'w-64'
            }`}>

            {/* Header with toggle button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                {!isCollapsed && (
                    <h2 className="text-xl font-semibold text-gray-800">Navigation</h2>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center space-x-2 p-3 transition-all duration-200 group ${isActive
                                ? 'bg-gradient-to-l from-sky-50 to-sky-25 text-sky-600 border-l-4 border-sky-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                                }`}
                            title={isCollapsed ? item.name : ''}
                        >
                            <IconComponent
                                className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'
                                    }`}
                            />
                            {!isCollapsed && (
                                <span className="font-medium transition-all duration-200">
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer with logout button */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group w-full text-gray-600 hover:bg-red-50 hover:text-red-600 hover:shadow-sm ${isCollapsed ? 'justify-center' : ''
                        }`}
                    title={isCollapsed ? "Logout" : ""}
                >
                    <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
                    {!isCollapsed && (
                        <span className="font-medium transition-all duration-200">
                            Logout
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;