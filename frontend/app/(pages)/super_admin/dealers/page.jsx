"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { getUser } from '@/app/lib/auth';
import api from "@/app/lib/axios";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        role: '',
        verified: '',
        search: ''
    });
    const [pagination, setPagination] = useState({});
    const user = getUser();

    // Memoize fetchUsers to prevent unnecessary recreations
    const fetchUsers = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const queryParams = new URLSearchParams({
                page,
                ...filters
            }).toString();

            const response = await api.get(`/auth/admin/allusers?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setUsers(response.data.users);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]); // Add filters as dependency

    useEffect(() => {
        if (user?.role !== 'admin') return;

        // Add debounce to prevent excessive API calls when typing
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500); // Wait 500ms after last filter change

        return () => clearTimeout(timeoutId);
    }, [filters, user?.role, fetchUsers]); // Use user.role instead of user object

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Add a separate handler for search with debouncing
    const handleSearchChange = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
    };

    if (user?.role !== 'super_admin') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600">Manage all users and dealers in the system</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search by name, email, phone..."
                        value={filters.search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="p-2 border rounded-lg"
                    />
                    <select
                        value={filters.role}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        className="p-2 border rounded-lg"
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="dealer">Dealer</option>
                        <option value="user">User</option>
                    </select>
                    <select
                        value={filters.verified}
                        onChange={(e) => handleFilterChange('verified', e.target.value)}
                        className="p-2 border rounded-lg"
                    >
                        <option value="">All Status</option>
                        <option value="true">Verified</option>
                        <option value="false">Not Verified</option>
                    </select>
                    <button
                        onClick={() => setFilters({ role: '', verified: '', search: '' })}
                        className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left">User</th>
                                <th className="p-4 text-left">Role</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Dealer Info</th>
                                <th className="p-4 text-left">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4">
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                            <p className="text-sm text-gray-600">{user.phone}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'dealer' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${user.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {user.verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {user.role === 'dealer' ? (
                                            user.dealerProfile ? (
                                                <div>
                                                    <p className="font-medium">{user.dealerProfile.businessName}</p>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${user.dealerProfile.isVerified ?
                                                        'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {user.dealerProfile.isVerified ? 'Verified' : 'Pending'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-yellow-600 text-sm">Profile Incomplete</span>
                                            )
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="p-4 border-t flex justify-between items-center">
                        <button
                            onClick={() => fetchUsers(pagination.currentPage - 1)}
                            disabled={!pagination.hasPrev}
                            className="p-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                        <button
                            onClick={() => fetchUsers(pagination.currentPage + 1)}
                            disabled={!pagination.hasNext}
                            className="p-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersPage;