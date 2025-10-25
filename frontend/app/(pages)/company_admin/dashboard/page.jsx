"use client";
import { useState, useEffect } from 'react';
import { getUser } from '@/lib/auth';
import {
  BarChart3,
  Users,
  Home,
  Calendar,
  TrendingUp,
  DollarSign,
  Eye,
  Plus,
  ArrowUp,
  ArrowDown,
  Building2,
  Search
} from 'lucide-react';

const CompanyAdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    fetchDashboardData();
  }, [timeRange]);

  // Mock data - replace with actual API calls
  const fetchDashboardData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStats({
        overview: {
          totalProperties: 45,
          activeProperties: 38,
          pendingProperties: 7,
          totalDealers: 12,
          activeDealers: 10,
          totalBookings: 156,
          monthlyRevenue: 125000,
          occupancyRate: 84.2,
          growthRate: 12.5
        },
        revenueData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [85000, 92000, 105000, 98000, 112000, 125000]
        },
        propertyTypes: [
          { type: 'Residential', count: 28, percentage: 62 },
          { type: 'Commercial', count: 12, percentage: 27 },
          { type: 'Industrial', count: 5, percentage: 11 }
        ],
        recentActivities: [
          { id: 1, type: 'booking', message: 'New booking for Property #123', time: '2 hours ago' },
          { id: 2, type: 'property', message: 'Property #456 approved', time: '5 hours ago' },
          { id: 3, type: 'dealer', message: 'New dealer registered', time: '1 day ago' },
          { id: 4, type: 'booking', message: 'Booking completed for Property #789', time: '2 days ago' }
        ],
        topDealers: [
          { id: 1, name: 'John Smith', properties: 8, bookings: 23, revenue: 45000 },
          { id: 2, name: 'Sarah Johnson', properties: 6, bookings: 18, revenue: 38000 },
          { id: 3, name: 'Mike Wilson', properties: 5, bookings: 15, revenue: 32000 },
          { id: 4, name: 'Emily Brown', properties: 4, bookings: 12, revenue: 28000 }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'company_admin') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business.</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            {['weekly', 'monthly', 'quarterly', 'yearly'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Properties"
            value={stats.overview.totalProperties}
            icon={Home}
            change={stats.overview.growthRate}
            color="blue"
          />
          <StatCard
            title="Active Dealers"
            value={stats.overview.activeDealers}
            icon={Users}
            change={8.2}
            color="green"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.overview.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            change={15.3}
            color="purple"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${stats.overview.occupancyRate}%`}
            icon={TrendingUp}
            change={5.1}
            color="orange"
          />
        </div>

        {/* Charts and Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Revenue
                </div>
              </div>
            </div>
            <div className="h-64">
              <SimpleBarChart data={stats.revenueData} />
            </div>
          </div>

          {/* Property Types */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Property Distribution</h3>
            <div className="space-y-4">
              {stats.propertyTypes.map((type, index) => (
                <div key={type.type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{type.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{type.count}</div>
                    <div className="text-xs text-gray-500">{type.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 mt-2 rounded-full ${activity.type === 'booking' ? 'bg-green-500' :
                      activity.type === 'property' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Dealers */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Dealers</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {stats.topDealers.map((dealer, index) => (
                <div key={dealer.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{dealer.name}</p>
                      <p className="text-xs text-gray-500">{dealer.properties} properties</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${dealer.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{dealer.bookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <QuickAction
              icon={Plus}
              title="Add Property"
              description="List a new property"
              href={`/${user.role}/properties/add`}
              color="blue"
            />
            <QuickAction
              icon={Users}
              title="Manage Dealers"
              description="View all dealers"
              href={`/${user.role}/dealer`}
              color="green"
            />
            <QuickAction
              icon={BarChart3}
              title="View Reports"
              description="Detailed analytics"
              href={`/${user.role}/analytics`}
              color="purple"
            />
            <QuickAction
              icon={Eye}
              title="Monitor Bookings"
              description="Check all bookings"
              href={`/${user.role}/bookings`}
              color="orange"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, change, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
            {change >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            {Math.abs(change)}% from last period
          </div>
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Simple Bar Chart Component
const SimpleBarChart = ({ data }) => {
  const maxValue = Math.max(...data.data);

  return (
    <div className="h-full flex items-end justify-between space-x-2">
      {data.data.map((value, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="text-xs text-gray-500 mb-2">{data.labels[index]}</div>
          <div
            className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all duration-200"
            style={{ height: `${(value / maxValue) * 100}%` }}
          ></div>
          <div className="text-xs text-gray-700 mt-2">${(value / 1000).toFixed(0)}K</div>
        </div>
      ))}
    </div>
  );
};

// Quick Action Component
const QuickAction = ({ icon: Icon, title, description, href, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
  };

  return (
    <a
      href={href}
      className={`p-4 rounded-lg border-2 border-transparent hover:border-current transition-all duration-200 ${colorClasses[color]}`}
    >
      <Icon className="w-8 h-8 mb-3" />
      <h4 className="font-semibold text-lg mb-1">{title}</h4>
      <p className="text-sm opacity-75">{description}</p>
    </a>
  );
};

export default CompanyAdminDashboard;