'use client';

import { motion } from 'framer-motion';
import { Clock, Eye, FileText, User } from 'lucide-react';

interface AnalyticsData {
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
    created_at: string;
  };
  login_events: Array<{
    id: number;
    user_id: number;
    login_timestamp: string;
  }>;
  page_visits: Array<{
    id: number;
    user_id: number;
    page_name: string;
    entry_time: string;
    exit_time?: string;
    duration_seconds?: number;
  }>;
  form_submissions: Array<{
    id: number;
    user_id: number;
    feedback: string;
    rating: number;
    submitted_at: string;
  }>;
}

interface AnalyticsTableProps {
  analytics: AnalyticsData[];
}

export default function AnalyticsTable({ analytics }: AnalyticsTableProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getTotalDuration = (visits: any[]) => {
    return visits.reduce((total, visit) => total + (visit.duration_seconds || 0), 0);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">User Analytics</h2>
      
      <div className="space-y-6">
        {analytics.map((data) => (
          <motion.div
            key={data.user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {data.user.username}
                  </h3>
                  <p className="text-sm text-gray-500">{data.user.email}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                data.user.role === 'admin' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {data.user.role}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Login Events */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-900">Login Events</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {data.login_events.length}
                </p>
                <p className="text-sm text-blue-600">
                  Last login: {data.login_events.length > 0 
                    ? new Date(data.login_events[data.login_events.length - 1].login_timestamp).toLocaleString()
                    : 'Never'
                  }
                </p>
              </div>

              {/* Page Visits */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Eye className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-900">Page Visits</h4>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {data.page_visits.length}
                </p>
                <p className="text-sm text-green-600">
                  Total time: {formatDuration(getTotalDuration(data.page_visits))}
                </p>
              </div>

              {/* Form Submissions */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-purple-900">Submissions</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {data.form_submissions.length}
                </p>
                <p className="text-sm text-purple-600">
                  {data.form_submissions.length > 0 
                    ? `Avg rating: ${(data.form_submissions.reduce((sum, sub) => sum + sub.rating, 0) / data.form_submissions.length).toFixed(1)}/5`
                    : 'No submissions'
                  }
                </p>
              </div>
            </div>

            {/* Detailed Page Visits */}
            {data.page_visits.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Page Visit Details</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Page
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Entry Time
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.page_visits.map((visit) => (
                        <tr key={visit.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {visit.page_name}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {new Date(visit.entry_time).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {formatDuration(visit.duration_seconds)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Form Submissions */}
            {data.form_submissions.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Form Submissions</h4>
                <div className="space-y-3">
                  {data.form_submissions.map((submission) => (
                    <div key={submission.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            Rating: {submission.rating}/5
                          </span>
                          <div className="flex ml-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${
                                  star <= submission.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(submission.submitted_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{submission.feedback}</p>
                    </div>
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