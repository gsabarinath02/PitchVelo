'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, User, Mail, Phone, FileText, Calendar, CheckCircle, Heart, Sparkles, MessageCircle, Clock } from 'lucide-react';
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
        const response = await formsAPI.getSubmissions();
        // Get the most recent submission for the current user
        const submissions = response.data;
        if (submissions && submissions.length > 0) {
          setSubmission(submissions[0]); // Most recent submission
        } else {
          setSubmission(null);
        }
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your submission...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-6">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Submission Found</h3>
          <p className="text-gray-600 text-lg mb-6">
            You haven't submitted any feedback yet. Complete the presentation and share your thoughts with us!
          </p>
          <div className="inline-flex items-center justify-center px-6 py-3 bg-primary-100 text-primary-700 rounded-lg">
            <MessageCircle className="h-5 w-5 mr-2" />
            <span>Share your feedback to see it here</span>
          </div>
        </div>
      </motion.div>
    );
  }

  const selectedOptions = submission.selected_options 
    ? JSON.parse(submission.selected_options) 
    : [];

  const getRatingText = (rating: number) => {
    const ratings = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return ratings[rating as keyof typeof ratings] || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl text-white p-8"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Your Submission</h2>
            <p className="text-green-100 text-lg">
              Submitted on {new Date(submission.submitted_at).toLocaleDateString()} at{' '}
              {new Date(submission.submitted_at).toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="font-semibold">Rating</span>
            </div>
            <p className="text-2xl font-bold">{submission.rating}/5</p>
            <p className="text-green-100 text-sm">{getRatingText(submission.rating)}</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="h-5 w-5 text-blue-300" />
              <span className="font-semibold">Feedback</span>
            </div>
            <p className="text-2xl font-bold">{submission.feedback.length}</p>
            <p className="text-green-100 text-sm">characters</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-300" />
              <span className="font-semibold">Services</span>
            </div>
            <p className="text-2xl font-bold">{selectedOptions.length}</p>
            <p className="text-green-100 text-sm">selected</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rating and Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Star className="h-6 w-6 text-yellow-500 mr-3" />
            Rating & Feedback
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Rating
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl ${
                        star <= submission.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="bg-yellow-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-yellow-800">
                    {getRatingText(submission.rating)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Feedback
              </label>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <p className="text-gray-900 leading-relaxed">{submission.feedback}</p>
              </div>
            </div>

            {submission.suggestions && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Suggestions for Improvement
                </label>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <p className="text-gray-900 leading-relaxed">{submission.suggestions}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <User className="h-6 w-6 text-blue-600 mr-3" />
            Contact Information
          </h3>
          
          <div className="space-y-4">
            {submission.contact_name && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-gray-900 font-semibold">{submission.contact_name}</p>
                </div>
              </div>
            )}

            {submission.contact_email && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-900 font-semibold">{submission.contact_email}</p>
                </div>
              </div>
            )}

            {submission.contact_phone && (
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Phone className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-gray-900 font-semibold">{submission.contact_phone}</p>
                </div>
              </div>
            )}

            {submission.contact_notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Notes
                </label>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                  <p className="text-gray-900 leading-relaxed">{submission.contact_notes}</p>
                </div>
              </div>
            )}

            {!submission.contact_name && !submission.contact_email && !submission.contact_phone && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No contact information provided</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Selected Services */}
      {selectedOptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Sparkles className="h-6 w-6 text-purple-600 mr-3" />
            Services of Interest
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedOptions.map((option: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-gray-900 font-medium">{option}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Submission Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Clock className="h-6 w-6 text-gray-600 mr-3" />
          Submission Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Submission ID
            </label>
            <span className="text-gray-900 font-mono text-lg">#{submission.id}</span>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Submitted At
            </label>
            <span className="text-gray-900 font-semibold">
              {new Date(submission.submitted_at).toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 