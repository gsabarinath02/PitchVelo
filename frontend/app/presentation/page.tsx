'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PresentationViewer from '@/components/PresentationViewer';
import FormSubmission from '@/components/FormSubmission';
import FormSubmissionDetails from '@/components/FormSubmissionDetails';
import SubmissionSuccess from '@/components/SubmissionSuccess';
import { createPageTracker } from '@/lib/tracking';
import { 
  User, 
  LogOut, 
  BarChart3, 
  BookOpen,
  ChevronRight,
  Play,
  CheckCircle,
  FileText,
  Eye,
  ArrowLeft,
  Menu
} from 'lucide-react';

export default function PresentationPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showSubmissionDetails, setShowSubmissionDetails] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pageTrackerRef = useRef<ReturnType<typeof createPageTracker> | null>(null);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // Initialize page tracker
    pageTrackerRef.current = createPageTracker('presentation');
    
    // Start tracking
    pageTrackerRef.current.startTracking();
    
    // Setup exit handlers
    const cleanup = pageTrackerRef.current.setupPageExitHandlers();
    
    return cleanup;
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleBackToAdmin = () => {
    if (user?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/presentation');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={['user', 'admin']}>
      <div className="min-h-screen gradient-bg">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm border-b border-gray-200"
        >
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Back button and title */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={handleBackToAdmin}
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </button>
                <div className="hidden sm:block text-gray-400">|</div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-gray-900">Presentation Analytics</span>
                </div>
              </div>
              
              {/* Right side - User menu */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Desktop user info */}
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Welcome, {user.username}</span>
                </div>
                
                {/* Mobile menu button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
                
                {/* Desktop dropdown */}
                <div className="hidden md:relative">
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
                        onClick={handleBackToAdmin}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>{user.role === 'admin' ? 'Admin Dashboard' : 'Presentation'}</span>
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
            
            {/* Mobile menu */}
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:hidden mt-3 pt-3 border-t border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Welcome, {user.username}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setShowSubmissionDetails(true);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <FileText className="h-4 w-4" />
                    <span>My Submission</span>
                  </button>
                  <button
                    onClick={() => {
                      handleBackToAdmin();
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>{user.role === 'admin' ? 'Admin' : 'Dashboard'}</span>
                  </button>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full mt-2 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <div className="w-full sm:w-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Presentation Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Explore our presentation and share your valuable feedback
                </p>
              </div>
                
              <div className="flex items-center space-x-2 sm:space-x-4 mt-3 sm:mt-0 w-full sm:w-auto">
                {!showForm && !showSubmissionDetails && (
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                    <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Slide {currentSlide + 1} of 5</span>
                  </div>
                )}
                
                {(showForm || showSuccess) && !showSubmissionDetails && (
                  <button
                    onClick={() => setShowSubmissionDetails(true)}
                    className="btn-secondary flex items-center space-x-2 text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>View My Submission</span>
                  </button>
                )}
                
                {showSubmissionDetails && (
                  <button
                    onClick={() => setShowSubmissionDetails(false)}
                    className="btn-secondary flex items-center space-x-2 text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{showForm ? 'Back to Form' : showSuccess ? 'Back to Success' : 'Back to Presentation'}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

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
            ) : showSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <SubmissionSuccess
                  onViewSubmission={() => setShowSubmissionDetails(true)}
                  onContinue={() => setShowSuccess(false)}
                />
              </motion.div>
            ) : !showForm ? (
              <div className="space-y-6">
                <PresentationViewer
                  currentSlide={currentSlide}
                  setCurrentSlide={setCurrentSlide}
                  onComplete={() => setShowForm(true)}
                />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Presentation Complete!
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    Thank you for viewing our presentation. Please share your feedback below.
                  </p>
                </div>
                
                <FormSubmission 
                  onComplete={() => setShowSuccess(true)} 
                  onViewSubmission={() => setShowSubmissionDetails(true)}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 