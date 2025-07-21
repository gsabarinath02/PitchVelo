'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import PresentationViewer from '@/components/PresentationViewer';
import FormSubmission from '@/components/FormSubmission';
import { analyticsAPI } from '@/lib/api';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [pageVisitId, setPageVisitId] = useState<number | null>(null);

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user.username}!
          </h1>
          <p className="text-gray-600">
            Explore our presentation and share your feedback
          </p>
        </motion.div>

        {!showForm ? (
          <PresentationViewer
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            onComplete={() => setShowForm(true)}
          />
        ) : (
          <FormSubmission onComplete={() => router.push('/admin')} />
        )}
      </div>
    </div>
  );
} 