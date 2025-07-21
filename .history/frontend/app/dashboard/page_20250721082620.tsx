'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import PresentationViewer from '@/components/PresentationViewer';
import FormSubmission from '@/components/FormSubmission';
import FormSubmissionDetails from '@/components/FormSubmissionDetails';
import { analyticsAPI } from '@/lib/api';
import { 
  User, 
  LogOut, 
  Settings, 
  BarChart3, 
  BookOpen,
  ChevronRight,
  Play,
  CheckCircle,
  FileText,
  Eye
} from 'lucide-react';

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showSubmissionDetails, setShowSubmissionDetails] = useState(false);
  const [pageVisitId, setPageVisitId] = useState<number | null>(null);
  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // Track page visit
    const trackPageVisit = async () => {
      try {
        const response = await analyticsAPI.createPageVisit({ page_name: 'dashboard' });
        setPageVisitId(response.data.id);
      } catch (error) {
        console.error('Failed to track page visit:', error);
      }
    };
    
    trackPageVisit();

    // Track page exit
    const handleBeforeUnload = async () => {
      if (pageVisitId) {
        try {
          await analyticsAPI.updatePageVisit(pageVisitId, {
            exit_time: new Date().toISOString(),
            duration_seconds: Date.now() / 1000,
          });
        } catch (error) {
          console.error('Failed to update page visit:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [token, router, pageVisitId]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Presentation Analytics</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Welcome, {user.username}</span>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowNavigation(!showNavigation)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${showNavigation ? 'rotate-90' : ''}`} />
                </button>
                
                {showNavigation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <button
                      onClick={() => setShowSubmissionDetails(true)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>My Submission</span>
                    </button>
                    <button
                      onClick={() => router.push('/admin')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
                      <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Presentation Dashboard
                </h1>
                <p className="text-gray-600">
                  Explore our presentation and share your valuable feedback
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {!showForm && !showSubmissionDetails && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Play className="h-4 w-4" />
                    <span>Slide {currentSlide + 1} of 5</span>
                  </div>
                )}
                
                {showForm && (
                  <button
                    onClick={() => setShowSubmissionDetails(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View My Submission</span>
                  </button>
                )}
                
                {showSubmissionDetails && (
                  <button
                    onClick={() => setShowSubmissionDetails(false)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Back to Form</span>
                  </button>
                )}
              </div>
            </div>
        </motion.div>

        {/* Progress Indicator */}
        {!showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSlide + 1) / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {Math.round(((currentSlide + 1) / 5) * 100)}% Complete
              </span>
            </div>
          </motion.div>
        )}

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {showSubmissionDetails ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <FormSubmissionDetails />
            </motion.div>
          ) : !showForm ? (
            <div className="space-y-6">
              <PresentationViewer
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
                onComplete={() => setShowForm(true)}
              />
              
              {/* Quick Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-2">
                  {[0, 1, 2, 3, 4].map((slide) => (
                    <button
                      key={slide}
                      onClick={() => setCurrentSlide(slide)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        slide === currentSlide 
                          ? 'bg-primary-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentSlide(Math.min(4, currentSlide + 1))}
                  disabled={currentSlide === 4}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          ) : showSubmissionDetails ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <FormSubmissionDetails />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Presentation Complete!
                </h2>
                <p className="text-gray-600">
                  Thank you for viewing our presentation. Please share your feedback below.
                </p>
              </div>
              
              <FormSubmission 
                onComplete={() => router.push('/admin')} 
                onViewSubmission={() => setShowSubmissionDetails(true)}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 