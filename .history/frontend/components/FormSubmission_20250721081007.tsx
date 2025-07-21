'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { formsAPI } from '@/lib/api';

interface FormSubmissionProps {
  onComplete: () => void;
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

export default function FormSubmission({ onComplete }: FormSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [currentRating, setCurrentRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>();

  const watchedRating = watch('rating') || currentRating;

  const options = [
    'Partnership Discussion',
    'Book a live demo',
    'Proposal & Contract'
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
      toast.success('Thank you for your feedback!');
      onComplete();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="card">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Share Your Feedback
          </h1>
          <p className="text-gray-600">
            Help us improve our services and get in touch with you
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate this presentation? *
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingClick(rating)}
                  className="p-2 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-8 w-8 ${
                      rating <= watchedRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">Please select a rating</p>
            )}
          </div>

          {/* Feedback */}
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback *
            </label>
            <textarea
              {...register('feedback', { required: 'Feedback is required' })}
              id="feedback"
              rows={4}
              className="input-field"
              placeholder="Share your thoughts about the presentation..."
            />
            {errors.feedback && (
              <p className="mt-1 text-sm text-red-600">{errors.feedback.message}</p>
            )}
          </div>

          {/* Selected Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which services interest you?
            </label>
            <div className="space-y-2">
              {options.map((option) => (
                <label key={option} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionToggle(option)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <label htmlFor="suggestions" className="block text-sm font-medium text-gray-700 mb-2">
              Suggestions for Improvement
            </label>
            <textarea
              {...register('suggestions')}
              id="suggestions"
              rows={3}
              className="input-field"
              placeholder="Any suggestions to improve our services..."
            />
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  {...register('contact_name')}
                  type="text"
                  id="contact_name"
                  className="input-field"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  {...register('contact_email')}
                  type="email"
                  id="contact_email"
                  className="input-field"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                {...register('contact_phone')}
                type="tel"
                id="contact_phone"
                className="input-field"
                placeholder="Your phone number"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="contact_notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                {...register('contact_notes')}
                id="contact_notes"
                rows={3}
                className="input-field"
                placeholder="Any additional information or questions..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
} 