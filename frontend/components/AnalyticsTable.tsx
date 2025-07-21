'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, LogOut, LogIn, FileText, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { SimplifiedUserAnalytics } from '@/lib/api';

interface AnalyticsTableProps {
  analytics: SimplifiedUserAnalytics[];
}

export default function AnalyticsTable({ analytics }: AnalyticsTableProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (analytics && analytics.length > 0) {
      setIsLoading(false);
    }
  }, [analytics]);

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analytics data available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">User Session Analytics</h2>
      
      <div className="space-y-6">
        {analytics.map((data, index) => (
          <motion.div
            key={data.user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            {/* User Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {data.user.username}
                  </h3>
                  <p className="text-sm text-gray-500">{data.user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  data.user.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {data.user.role}
                </span>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  data.has_submitted_form 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {data.has_submitted_form ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {data.has_submitted_form ? 'Form Submitted' : 'No Form Submitted'}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <LogIn className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-900">Total Logins</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {data.total_logins}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-900">Total Time</h4>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatDuration(data.total_time_spent_seconds)}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-purple-900">Form Status</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {data.has_submitted_form ? 'Yes' : 'No'}
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-orange-600 mr-2" />
                  <h4 className="font-semibold text-orange-900">Avg Session</h4>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {data.total_logins > 0 
                    ? formatDuration(data.total_time_spent_seconds / data.total_logins)
                    : '0s'
                  }
                </p>
              </div>
            </div>

            {/* Session Details */}
            {data.sessions.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Session History</h4>
                <div className="space-y-3">
                  {data.sessions.map((session, sessionIndex) => (
                    <motion.div
                      key={sessionIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: sessionIndex * 0.05 }}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <LogIn className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Login</p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(session.login_timestamp)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {session.logout_timestamp ? (
                            <>
                              <LogOut className="h-4 w-4 text-red-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Logout</p>
                                <p className="text-xs text-gray-500">
                                  {formatDateTime(session.logout_timestamp)}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-yellow-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Status</p>
                                <p className="text-xs text-yellow-600">Active Session</p>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Duration</p>
                            <p className="text-xs text-gray-500">
                              {formatDuration(session.session_duration_seconds || 0)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {session.has_submitted_form ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">Form</p>
                            <p className="text-xs text-gray-500">
                              {session.has_submitted_form ? 'Submitted' : 'Not Submitted'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 