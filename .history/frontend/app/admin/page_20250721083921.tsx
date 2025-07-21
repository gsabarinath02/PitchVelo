'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import AdminUserTable from '@/components/AdminUserTable';
import AnalyticsTable from '@/components/AnalyticsTable';
import SubmissionsTable from '@/components/SubmissionsTable';
import { usersAPI, analyticsAPI } from '@/lib/api';
import { AnimatePresence } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  Activity, 
  TrendingUp, 
  UserCheck, 
  Eye,
  Calendar,
  Clock
} from 'lucide-react';

export default function AdminPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVisits: 0,
    totalSubmissions: 0,
    avgRating: 0
  });

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const [usersResponse, analyticsResponse] = await Promise.all([
          usersAPI.getAll(),
          analyticsAPI.getUserAnalytics(),
        ]);
        
        setUsers(usersResponse.data);
        setAnalytics(analyticsResponse.data);
        
        // Calculate stats
        const totalUsers = usersResponse.data.length;
        const totalVisits = analyticsResponse.data.reduce((acc: number, user: any) => 
          acc + (user.page_visits?.length || 0), 0);
        const totalSubmissions = analyticsResponse.data.reduce((acc: number, user: any) => 
          acc + (user.form_submissions?.length || 0), 0);
        const avgRating = analyticsResponse.data.reduce((acc: number, user: any) => {
          const userRating = user.form_submissions?.reduce((sum: number, submission: any) => 
            sum + (submission.rating || 0), 0) || 0;
          const userCount = user.form_submissions?.length || 0;
          return acc + (userCount > 0 ? userRating / userCount : 0);
        }, 0) / (analyticsResponse.data.length || 1);

        setStats({
          totalUsers,
          totalVisits,
          totalSubmissions,
          avgRating: Math.round(avgRating * 10) / 10
        });
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {user.username}! Here's what's happening with your platform.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="border-l-blue-500"
          />
          <StatCard
            title="Page Visits"
            value={stats.totalVisits}
            icon={Eye}
            color="border-l-green-500"
          />
          <StatCard
            title="Form Submissions"
            value={stats.totalSubmissions}
            icon={UserCheck}
            color="border-l-purple-500"
          />
          <StatCard
            title="Avg Rating"
            value={`${stats.avgRating}/5`}
            icon={TrendingUp}
            color="border-l-yellow-500"
          />
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card mb-6"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <Activity className="h-8 w-8 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Platform Overview</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Your presentation analytics platform is running smoothly. 
                    Monitor user engagement and feedback to optimize your content.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-blue-700">
                          {stats.totalUsers} users registered
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700">
                          {stats.totalVisits} page visits recorded
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-purple-700">
                          {stats.totalSubmissions} feedback forms submitted
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700">Average Rating</span>
                        <span className="font-semibold text-green-900">{stats.avgRating}/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700">Engagement Rate</span>
                        <span className="font-semibold text-green-900">
                          {stats.totalUsers > 0 ? Math.round((stats.totalSubmissions / stats.totalUsers) * 100) : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700">Active Users</span>
                        <span className="font-semibold text-green-900">{stats.totalUsers}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'users' && (
              <AdminUserTable users={users} />
            )}
            
            {activeTab === 'analytics' && (
              <AnalyticsTable analytics={analytics} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 