'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, Heart, MessageCircle, User, Mail, Phone, FileText, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { formsAPI } from '@/lib/api';

interface FormSubmissionProps {
  onComplete: () => void;
  onViewSubmission?: () => void;
}

interface FormData {
  feedback: string;
  rating: number;
  suggestions?: string;
  selected_options?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_notes?: string;
}

export default function FormSubmission({ onComplete, onViewSubmission }: FormSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>();

  const watchedRating = watch('rating') || currentRating;

  const options = [
    { id: 'partnership', label: 'Partnership Discussion', icon: Heart, description: 'Explore collaboration opportunities' },
    { id: 'demo', label: 'Book a live demo', icon: Sparkles, description: 'See our platform in action' },
    { id: 'proposal', label: 'Proposal & Contract', icon: FileText, description: 'Get detailed pricing and terms' }
  ];

  const handleOptionToggle = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handleRatingClick = (rating: number) => {
    setCurrentRating(rating);
    setValue('rating', rating);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        selected_options: JSON.stringify(selectedOptions),
      };
      
      await formsAPI.submit(formData);
      toast.success('Thank you for your feedback! Your submission has been saved successfully.');
      onComplete();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 sm:px-8 py-4 sm:py-6 text-white">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full mb-3 sm:mb-4"
            >
              <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Share Your Feedback</h1>
            <p className="text-primary-100 text-sm sm:text-base md:text-lg">
              Help us improve our services and get in touch with you
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Rating Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  How would you rate this presentation?
                </h2>
                <p className="text-sm sm:text-base text-gray-600">Your rating helps us improve our content</p>
              </div>
              
              <div className="flex justify-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <motion.button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 sm:p-2 transition-all duration-200"
                  >
                    <Star
                      className={`h-8 w-8 sm:h-10 sm:w-10 transition-all duration-200 ${
                        rating <= (hoveredRating || watchedRating)
                          ? 'text-yellow-400 fill-current drop-shadow-lg'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              
              {watchedRating > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="text-lg font-medium text-gray-900">
                    {getRatingText(watchedRating)}
                  </p>
                </motion.div>
              )}
              
              {errors.rating && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600 text-center"
                >
                  Please select a rating
                </motion.p>
              )}
            </motion.div>

            {/* Feedback Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary-600" />
                Your Feedback
              </h2>
              <textarea
                {...register('feedback', { required: 'Feedback is required' })}
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                placeholder="Share your thoughts about the presentation, what you liked, what could be improved..."
              />
              {errors.feedback && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.feedback.message}
                </motion.p>
              )}
            </motion.div>

            {/* Services Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary-600" />
                Which services interest you?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {options.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedOptions.includes(option.label);
                  
                  return (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative cursor-pointer rounded-lg border-2 p-3 sm:p-4 transition-all duration-200 ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300 bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleOptionToggle(option.label)}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className={`p-1.5 sm:p-2 rounded-full ${
                          isSelected ? 'bg-primary-100' : 'bg-gray-200'
                        }`}>
                          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${
                            isSelected ? 'text-primary-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium text-sm sm:text-base ${
                            isSelected ? 'text-primary-900' : 'text-gray-900'
                          }`}>
                            {option.label}
                          </h3>
                          <p className={`text-xs sm:text-sm ${
                            isSelected ? 'text-primary-700' : 'text-gray-600'
                          }`}>
                            {option.description}
                          </p>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1 right-1 sm:top-2 sm:right-2"
                          >
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Suggestions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary-600" />
                Suggestions for Improvement
              </h2>
              <textarea
                {...register('suggestions')}
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                placeholder="Any suggestions to improve our services, features you'd like to see, or areas for enhancement..."
              />
            </motion.div>

            {/* Contact Information Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary-600" />
                Contact Information
                <span className="ml-2 text-xs sm:text-sm font-normal text-gray-500">(Optional)</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Name
                  </label>
                  <input
                    {...register('contact_name')}
                    type="text"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    Email
                  </label>
                  <input
                    {...register('contact_email')}
                    type="email"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  Phone Number
                </label>
                <input
                  {...register('contact_phone')}
                  type="tel"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Your phone number"
                />
              </div>

              <div className="mt-4 sm:mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2 text-gray-500" />
                  Additional Notes
                </label>
                <textarea
                  {...register('contact_notes')}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                  placeholder="Any additional information, questions, or specific requirements..."
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                    <span className="text-sm sm:text-base">Submitting...</span>
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="text-sm sm:text-base">Submit Feedback</span>
                  </>
                )}
              </button>
              
              <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                Your feedback helps us improve our services and better serve our customers.
              </p>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  );
} 