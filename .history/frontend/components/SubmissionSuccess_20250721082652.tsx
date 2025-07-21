'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Eye, ArrowRight } from 'lucide-react';

interface SubmissionSuccessProps {
  onViewSubmission: () => void;
  onContinue: () => void;
}

export default function SubmissionSuccess({ onViewSubmission, onContinue }: SubmissionSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Submission Successful!
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Thank you for your valuable feedback. Your submission has been saved and will help us improve our services.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onViewSubmission}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <Eye className="h-5 w-5" />
          <span>View My Submission</span>
        </button>
        
        <button
          onClick={onContinue}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <span>Continue</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
} 