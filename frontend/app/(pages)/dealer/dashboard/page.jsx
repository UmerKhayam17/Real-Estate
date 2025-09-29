"use client"
import React, { useState, useEffect } from 'react';
import { getUser } from '@/lib/auth';

const DealerDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDealers: 0,
    pendingDealers: 0,
    totalProperties: 0,
    activeBookings: 0,
    revenue: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API calls
        setTimeout(() => {
          setStats({
            totalUsers: 1247,
            totalDealers: 89,
            pendingDealers: 12,
            totalProperties: 567,
            activeBookings: 234,
            revenue: 125430
          });
          
          setRecentActivities([
            { id: 1, type: 'new_dealer', message: 'John Doe applied for dealer account', time: '2 mins ago' },
            { id: 2, type: 'property_added', message: 'New property added in Downtown', time: '15 mins ago' },
            { id: 3, type: 'booking', message: 'New booking confirmed for Villa #123', time: '1 hour ago' },
            { id: 4, type: 'user_registered', message: 'New user registered', time: '2 hours ago' },
            { id: 5, type: 'dealer_approved', message: 'Dealer ABC Realty approved', time: '3 hours ago' }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}!
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            Administrator
          </span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon="👥"
          color="hover:shadow-md transition-shadow duration-200"
          subtitle="+24 this month"
        />
        
        <StatCard
          title="Total Dealers"
          value={stats.totalDealers}
          icon="🏢"
          color="hover:shadow-md transition-shadow duration-200"
          subtitle="89 approved dealers"
        />
        
        <StatCard
          title="Pending Approvals"
          value={stats.pendingDealers}
          icon="⏳"
          color="hover:shadow-md transition-shadow duration-200 border-l-4 border-yellow-500"
          subtitle="Needs attention"
        />
        
        <StatCard
          title="Total Properties"
          value={stats.totalProperties.toLocaleString()}
          icon="🏠"
          color="hover:shadow-md transition-shadow duration-200"
          subtitle="567 active listings"
        />
        
        <StatCard
          title="Active Bookings"
          value={stats.activeBookings}
          icon="📅"
          color="hover:shadow-md transition-shadow duration-200"
          subtitle="Current bookings"
        />
        
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon="💰"
          color="hover:shadow-md transition-shadow duration-200"
          subtitle="Lifetime earnings"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
            <span className="text-2xl mb-2">👥</span>
            <span className="text-sm font-medium text-gray-700">Manage Users</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
            <span className="text-2xl mb-2">🏢</span>
            <span className="text-sm font-medium text-gray-700">Dealer Approvals</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
            <span className="text-2xl mb-2">🏠</span>
            <span className="text-sm font-medium text-gray-700">Properties</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200">
            <span className="text-2xl mb-2">📊</span>
            <span className="text-sm font-medium text-gray-700">Analytics</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  {activity.type === 'new_dealer' && '🏢'}
                  {activity.type === 'property_added' && '🏠'}
                  {activity.type === 'booking' && '📅'}
                  {activity.type === 'user_registered' && '👤'}
                  {activity.type === 'dealer_approved' && '✅'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Application</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Operational</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Healthy</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Pending Tasks</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">12 items</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Server Load</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">45%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default DealerDashboard;