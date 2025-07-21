'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, User, Mail, Phone, FileText, Calendar, CheckCircle } from 'lucide-react';
import { formsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface FormSubmissionData {
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
}

export default function FormSubmissionDetails() {
  const [submission, setSubmission] = useState<FormSubmissionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await formsAPI.getMySubmission();
        setSubmission(response.data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          // No submission found
          setSubmission(null);
        } else {
          toast.error('Failed to load submission details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Submission Found</h3>
        <p className="text-gray-600">You haven't submitted any feedback yet.</p>
      </motion.div>
    );
  }

  const selectedOptions = submission.selected_options 
    ? JSON.parse(submission.selected_options) 
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Submission</h2>
          <p className="text-gray-600">
            Submitted on {new Date(submission.submitted_at).toLocaleDateString()} at{' '}
            {new Date(submission.submitted_at).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating and Feedback */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 text-yellow-400 mr-2" />
            Rating & Feedback
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xl ${
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">{submission.feedback}</p>
              </div>
            </div>

            {submission.suggestions && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suggestions for Improvement
                </label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">{submission.suggestions}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 text-blue-600 mr-2" />
            Contact Information
          </h3>
          
          <div className="space-y-4">
            {submission.contact_name && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{submission.contact_name}</span>
                </div>
              </div>
            )}

            {submission.contact_email && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{submission.contact_email}</span>
                </div>
              </div>
            )}

            {submission.contact_phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{submission.contact_phone}</span>
                </div>
              </div>
            )}

            {submission.contact_notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">{submission.contact_notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Services */}
      {selectedOptions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 text-purple-600 mr-2" />
            Services of Interest
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedOptions.map((option: string, index: number) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg"
              >
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span className="text-gray-900">{option}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submission Details */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 text-gray-600 mr-2" />
          Submission Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submission ID
            </label>
            <span className="text-gray-900 font-mono">#{submission.id}</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submitted At
            </label>
            <span className="text-gray-900">
              {new Date(submission.submitted_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 