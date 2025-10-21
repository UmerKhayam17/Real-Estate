"use client";
import { useState, useEffect, useRef } from 'react';
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
    LogOut,
    ChevronDown
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const [expandedMenus, setExpandedMenus] = useState({});
    const pathname = usePathname();
    const router = useRouter();
    const user = getUser();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleMenu = (menuName) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };

    if (!isMounted) {
        return (
            <div className="bg-white shadow-xl border-r border-gray-200 w-64 h-full">
                <div className="animate-pulse p-4">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const menuConfigurations = {
        super_admin: [
            {
                name: 'Dashboard',
                icon: LayoutDashboard,
                links: [
                    { href: `/${user.role}/dashboard`, label: 'Overview' }
                ]
            },
            {
                name: 'User Management',
                icon: Users,
                links: [
                    { href: `/${user.role}/users`, label: 'All Users' },
                    { href: `/${user.role}/dealers`, label: 'Dealer Management' }
                ]
            },
            {
                name: 'Company Management',
                icon: Building2,
                links: [
                    { href: `/${user.role}/companies`, label: 'All Companies' },
                    { href: `/${user.role}/companies/pending`, label: 'Pending Companies' },
                    { href: `/${user.role}/companies/approved`, label: 'Approved Companies' }
                ]
            },
            {
                name: 'Properties',
                icon: Home,
                links: [
                    { href: `/${user.role}/properties`, label: 'All Properties' },
                    { href: `/${user.role}/pending-approvals`, label: 'Pending Approvals' }
                ]
            },
            {
                name: 'Bookings',
                icon: Calendar,
                links: [
                    { href: `/${user.role}/bookings`, label: 'All Bookings' }
                ]
            },
            {
                name: 'Plans & Analytics',
                icon: Crown,
                links: [
                    { href: `/${user.role}/plan`, label: 'Subscription Plans' },
                    { href: `/${user.role}/analytics`, label: 'Analytics' }
                ]
            },
            {
                name: 'Settings',
                icon: Settings,
                links: [
                    { href: `/${user.role}/settings`, label: 'System Settings' }
                ]
            }
        ],
        company_admin: [
            {
                name: 'Dashboard',
                icon: LayoutDashboard,
                links: [
                    { href: `/${user.role}/dashboard`, label: 'Overview' }
                ]
            },
            {
                name: 'Dealer Management',
                icon: Users,
                links: [
                    { href: `/${user.role}/dealer`, label: 'All Dealers' }
                ]
            },
            {
                name: 'Properties',
                icon: Home,
                links: [
                    { href: `/${user.role}/properties`, label: 'All Properties' },
                    { href: `/${user.role}/properties/add`, label: 'Add Property' },
                    { href: `/${user.role}/properties/my`, label: 'My Properties' }
                ]
            },
            {
                name: 'Profile',
                icon: User,
                links: [
                    { href: `/${user.role}/profile`, label: 'My Profile' }
                ]
            }
        ],
        dealer: [
            {
                name: 'Dashboard',
                icon: LayoutDashboard,
                links: [
                    { href: `/${user.role}/dashboard`, label: 'Overview' }
                ]
            },
            {
                name: 'Properties',
                icon: Home,
                links: [
                    { href: `/${user.role}/properties`, label: 'All Properties' },
                    { href: `/${user.role}/properties/my`, label: 'My Properties' },
                    { href: `/${user.role}/properties/add`, label: 'Add Property' }
                ]
            },
            {
                name: 'Bookings',
                icon: Calendar,
                links: [
                    { href: `/${user.role}/bookings`, label: 'My Bookings' }
                ]
            },
            {
                name: 'Find Agents',
                icon: Search,
                links: [
                    { href: `/${user.role}/findAgent`, label: 'Search Agents' }
                ]
            },
            {
                name: 'Profile',
                icon: User,
                links: [
                    { href: `/${user.role}/profile`, label: 'My Profile' }
                ]
            }
        ],
        user: [
            {
                name: 'Dashboard',
                icon: LayoutDashboard,
                links: [
                    { href: '/dashboard', label: 'Overview' }
                ]
            },
            {
                name: 'Properties',
                icon: Home,
                links: [
                    { href: '/properties', label: 'Browse Properties' }
                ]
            },
            {
                name: 'Bookings',
                icon: Calendar,
                links: [
                    { href: '/bookings', label: 'My Bookings' }
                ]
            },
            {
                name: 'Profile',
                icon: User,
                links: [
                    { href: '/profile', label: 'My Profile' }
                ]
            }
        ]
    };

    const menuItems = menuConfigurations[user.role] || [];

    const isMenuActive = (menu) => {
        return menu.links.some(link => pathname === link.href);
    };

    const isLinkActive = (href) => {
        return pathname === href;
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const renderMenuItem = (menu, index) => {
        const isActive = isMenuActive(menu);
        const isExpanded = expandedMenus[menu.name] && !isCollapsed;
        const hasMultipleLinks = menu.links.length > 1;

        if (!hasMultipleLinks) {
            const singleLink = menu.links[0];
            return (
                <Link
                    key={menu.name}
                    href={singleLink.href}
                    className={`flex items-center space-x-2 p-3 transition-all duration-200 group ${isLinkActive(singleLink.href)
                            ? 'bg-gradient-to-l from-sky-50 to-sky-25 text-sky-600 border-l-4 border-sky-600 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                        }`}
                    title={isCollapsed ? menu.name : ''}
                >
                    <menu.icon className={`w-5 h-5 transition-transform duration-200 ${isLinkActive(singleLink.href) ? 'scale-110' : 'group-hover:scale-105'
                        }`} />
                    {!isCollapsed && (
                        <span className="font-medium transition-all duration-200">
                            {menu.name}
                        </span>
                    )}
                </Link>
            );
        }

        return (
            <div key={menu.name}>
                <button
                    onClick={() => toggleMenu(menu.name)}
                    className={`flex items-center justify-between w-full p-3 transition-all duration-200 group ${isActive
                            ? 'bg-gradient-to-l from-sky-50 to-sky-25 text-sky-600 border-l-4 border-sky-600 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                        }`}
                    title={isCollapsed ? menu.name : ''}
                >
                    <div className="flex items-center space-x-2">
                        <menu.icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'
                            }`} />
                        {!isCollapsed && (
                            <span className="font-medium transition-all duration-200">
                                {menu.name}
                            </span>
                        )}
                    </div>
                    {!isCollapsed && hasMultipleLinks && (
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                                }`}
                        />
                    )}
                </button>

                {!isCollapsed && isExpanded && (
                    <div className="ml-4 space-y-1 border-l border-gray-200 pl-2">
                        {menu.links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center space-x-2 p-2 text-sm transition-all duration-200 group rounded ${isLinkActive(link.href)
                                        ? 'bg-sky-100 text-sky-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${isLinkActive(link.href) ? 'bg-sky-600' : 'bg-gray-400'
                                    }`} />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`bg-white shadow-xl border-r border-gray-200 transition-all duration-300 flex flex-col h-full ${isCollapsed ? 'w-16' : 'w-64'
            }`}>
            {/* Header */}
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
                {menuItems.map((menu, index) => renderMenuItem(menu, index))}
            </nav>

            {/* Footer */}
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