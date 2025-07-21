'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Star, 
  FileText, 
  Calendar, 
  MessageSquare,
  Download,
  Filter
} from 'lucide-react';
import { formsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface SubmissionData {
  id: number;
  user_id: number;
  feedback: string;
  rating: number;
  suggestions?: string;
  selected_options?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_notes?: string;
  submitted_at: string;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
    created_at: string;
  };
}

export default function SubmissionsTable() {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await formsAPI.getSubmissions();
        setSubmissions(response.data);
      } catch (error: any) {
        toast.error('Failed to load submissions');
        console.error('Error fetching submissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter(submission => {
    const matchesRating = filterRating === 'all' || 
      (filterRating === 'high' && submission.rating >= 4) ||
      (filterRating === 'medium' && submission.rating >= 2 && submission.rating < 4) ||
      (filterRating === 'low' && submission.rating < 2);
    
    const matchesSearch = searchTerm === '' || 
      submission.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.contact_phone?.includes(searchTerm) ||
      submission.feedback.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRating && matchesSearch;
  });

  const exportToCSV = () => {
    const headers = [
      'ID',
      'User',
      'Contact Name',
      'Email',
      'Phone',
      'Rating',
      'Feedback',
      'Selected Services',
      'Notes',
      'Submitted At'
    ];

    const csvData = filteredSubmissions.map(sub => [
      sub.id,
      sub.user.username,
      sub.contact_name || '',
      sub.contact_email || '',
      sub.contact_phone || '',
      sub.rating,
      sub.feedback.replace(/"/g, '""'),
      sub.selected_options ? JSON.parse(sub.selected_options).join(', ') : '',
      sub.contact_notes ? sub.contact_notes.replace(/"/g, '""') : '',
      new Date(sub.submitted_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Submissions exported to CSV');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Submissions</h2>
          <p className="text-gray-600">
            {filteredSubmissions.length} of {submissions.length} submissions
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, phone, or feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full"
          />
        </div>
        
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="input-field"
        >
          <option value="all">All Ratings</option>
          <option value="high">High (4-5 stars)</option>
          <option value="medium">Medium (2-3 stars)</option>
          <option value="low">Low (1 star)</option>
        </select>
      </div>

      {/* Submissions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Services
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feedback
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubmissions.map((submission) => {
              const selectedOptions = submission.selected_options 
                ? JSON.parse(submission.selected_options) 
                : [];
              
              return (
                <motion.tr
                  key={submission.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {submission.contact_name && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {submission.contact_name}
                          </span>
                        </div>
                      )}
                      
                      {submission.contact_email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <a 
                            href={`mailto:${submission.contact_email}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {submission.contact_email}
                          </a>
                        </div>
                      )}
                      
                      {submission.contact_phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a 
                            href={`tel:${submission.contact_phone}`}
                            className="text-sm text-green-600 hover:text-green-800"
                          >
                            {submission.contact_phone}
                          </a>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        User: {submission.user.username}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
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
                      <span className="text-sm text-gray-600">
                        {submission.rating}/5
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {selectedOptions.length > 0 ? (
                      <div className="space-y-1">
                        {selectedOptions.map((option: string, index: number) => (
                          <div key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {option}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">None selected</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 line-clamp-3">
                        {submission.feedback}
                      </p>
                      {submission.contact_notes && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <MessageSquare className="h-3 w-3" />
                            <span>Notes:</span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {submission.contact_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(submission.submitted_at).toLocaleTimeString()}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
          <p className="text-gray-600">
            {submissions.length === 0 
              ? 'No submissions have been made yet.'
              : 'No submissions match your current filters.'
            }
          </p>
        </div>
      )}
    </div>
  );
} 