'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Star, Clock, Users, TrendingUp } from 'lucide-react';
import { personalizedPresentationsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface PersonalizedPresentationViewerProps {
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  onComplete: () => void;
}

// Default slides (fallback when no personalized presentation is found)
const defaultSlides = [
  {
    id: 1,
    title: "Transforming Maha Marathon Experience",
    subtitle: "Complete Digital Event Management & Marketing Solution",
    content: {
      type: "welcome",
      logoSection: true,
      features: [
        { icon: "🏃‍♂️", title: "Current Partnership", desc: "Successfully managing photography and videography for Maha Marathon series across Maharashtra" },
        { icon: "🚀", title: "Next Evolution", desc: "Introducing comprehensive event management platform with AI-powered solutions" },
        { icon: "🎯", title: "Complete Solution", desc: "From registration to post-event engagement - all in one integrated platform" }
      ]
    }
  },
  {
    id: 2,
    title: "EventForce Platform",
    subtitle: "Complete Digital Backbone for Event Management",
    content: {
      type: "platform",
      features: [
        { icon: "📋", title: "Smart Registration System", desc: "Seamless participant registration with payment gateway integration" },
        { icon: "🤖", title: "AI-Powered Support Desk", desc: "24/7 automated customer support with intelligent query resolution" },
        { icon: "💬", title: "Omni-Channel Messaging", desc: "Unified console for WhatsApp, SMS, Email, Facebook, Instagram" },
        { icon: "📊", title: "Customer Data Platform", desc: "Advanced CRM with participant history and performance analytics" },
        { icon: "☁️", title: "Secure Cloud Storage", desc: "3TB storage for all event data with easy access and retrieval" },
        { icon: "📈", title: "Real-time Dashboards", desc: "Event-specific status dashboards with role-based access" }
      ]
    }
  },
  {
    id: 3,
    title: "Veloscope Creative Solutions",
    subtitle: "Strategic Marketing & Brand Amplification",
    content: {
      type: "creative",
      features: [
        { icon: "🎨", title: "Social Media Strategy", desc: "Comprehensive social media calendar and content creation" },
        { icon: "📸", title: "Photography & Video", desc: "Continued excellence in event photography with advanced tagging" },
        { icon: "🎯", title: "Campaign Management", desc: "Pre and post-event content-driven campaigns" },
        { icon: "📱", title: "Content Creation", desc: "Engaging visual content and promotional materials" },
        { icon: "📊", title: "Analytics & Tracking", desc: "Detailed performance analytics and ROI tracking" },
        { icon: "🎬", title: "Production Support", desc: "Optional production crew deployment for special shoots" }
      ]
    }
  },
  {
    id: 4,
    title: "Investment & Pricing",
    subtitle: "Exclusive Partnership Pricing",
    content: {
      type: "pricing",
      pricing: {
        title: "EventForce Platform - Special Pricing",
        subscription: "₹3,00,000/year",
        regularPrice: "₹4,50,000/year",
        savings: "₹1,50,000/year"
      },
      features: [
        { value: "3TB", label: "Cloud Storage" },
        { value: "18,000", label: "Message Credits/Year" },
        { value: "₹1.20", label: "Per Additional Message" },
        { value: "₹1.25", label: "Per Image Tagging" }
      ],
      creativePricing: {
        title: "Veloscope Social Media Services",
        annual: "₹1,00,000+GST/month",
        individual: "₹25,000+GST/month",
        shortTerm: "₹30,000+GST/month"
      }
    }
  },
  {
    id: 5,
    title: "Why Choose This Partnership?",
    subtitle: "Transforming Events, Amplifying Success",
    content: {
      type: "benefits",
      features: [
        { icon: "🏆", title: "Proven Track Record", desc: "Years of successful partnership in photography and videography" },
        { icon: "💰", title: "Significant Cost Savings", desc: "33% discount on platform subscription + preferential pricing" },
        { icon: "🔧", title: "End-to-End Solution", desc: "Single point of contact for all technology and creative needs" },
        { icon: "📈", title: "Data-Driven Growth", desc: "Enhanced participant engagement and retention through smart CRM" },
        { icon: "⚡", title: "Operational Efficiency", desc: "Streamlined processes reducing manual work and increasing productivity" },
        { icon: "🎯", title: "Brand Amplification", desc: "Strategic marketing approach to enhance reach and impact" }
      ]
    }
  },
  {
    id: 6,
    title: "Let's Make Maha Marathon Extraordinary",
    subtitle: "Your Success is Our Mission",
    content: {
      type: "cta",
      nextSteps: [
        { icon: "🤝", title: "Partnership Discussion", desc: "Detailed discussion about your specific requirements" },
        { icon: "💻", title: "Book a live demo", desc: "Hands-on demonstration of EventForce platform" },
        { icon: "📝", title: "Proposal & Contract", desc: "Customized proposal with detailed scope and timeline" }
      ],
      contact: {
        email: "support@veloscope.in",
        phone: "+91-8304033534",
        websites: ["https://velotales.veloscope.in", "https://website.eventforce.ai"]
      }
    }
  }
];

export default function PersonalizedPresentationViewer({ 
  currentSlide, 
  setCurrentSlide, 
  onComplete 
}: PersonalizedPresentationViewerProps) {
  const { user } = useAuth();
  const [slides, setSlides] = useState(defaultSlides);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPersonalizedPresentation();
  }, []);

  const loadPersonalizedPresentation = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await personalizedPresentationsAPI.getByUserId(user.id);
      const presentation = response.data;
      
      if (presentation && presentation.slides && presentation.slides.length > 0) {
        setSlides(presentation.slides);
      }
      // If no personalized presentation, use default slides
    } catch (error: any) {
      // If no personalized presentation found, use default slides
      console.log('No personalized presentation found, using default slides');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const slide = slides[currentSlide];

  const renderSlideContent = (slide: any) => {
    switch (slide.content.type) {
      case 'welcome':
        return (
          <div className="space-y-4">
            {/* Logo Section */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-40 h-12 flex items-center justify-center mb-1">
                  <img 
                    src="https://veloimages.s3.ap-south-1.amazonaws.com/Mangaluru%20Beach%20Festival%202025/proposal_logos/eventforce_logocolor.png" 
                    alt="EventForce Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-orange-600 font-semibold text-xs">Technology Platform</div>
              </motion.div>
              <div className="text-3xl text-gray-400 font-light">+</div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-20 h-20 flex items-center justify-center mb-1">
                  <img 
                    src="https://veloimages.s3.ap-south-1.amazonaws.com/Mangaluru%20Beach%20Festival%202025/proposal_logos/Veloscope_Logo%201.png" 
                    alt="Veloscope Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="font-bold text-gray-800 text-base">veloscope</div>
                <div className="text-green-600 font-semibold text-xs">Creative Solutions</div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {slide.content.features.map((item: any, index: number) => (
                <motion.div 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-2xl sm:text-3xl mb-2">{item.icon}</div>
                  <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'platform':
        return (
          <div className="space-y-4">
            <motion.div 
              className="flex justify-center mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-48 h-16 flex items-center justify-center">
                <img 
                  src="https://veloimages.s3.ap-south-1.amazonaws.com/Mangaluru%20Beach%20Festival%202025/proposal_logos/eventforce_logocolor.png" 
                  alt="EventForce Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {slide.content.features.map((item: any, index: number) => (
                <motion.div 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-2xl sm:text-3xl mb-2">{item.icon}</div>
                  <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="space-y-4">
            <motion.div 
              className="flex justify-center mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-center">
                <div className="w-24 h-24 flex items-center justify-center mb-2">
                  <img 
                    src="https://veloimages.s3.ap-south-1.amazonaws.com/Mangaluru%20Beach%20Festival%202025/proposal_logos/Veloscope_Logo%201.png" 
                    alt="Veloscope Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="font-bold text-gray-800 text-xl">veloscope</div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {slide.content.features.map((item: any, index: number) => (
                <motion.div 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-2xl sm:text-3xl mb-2">{item.icon}</div>
                  <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-4">
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4">
                <h3 className="text-lg font-bold text-center">{slide.content.pricing?.title || 'Platform Pricing'}</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-800">Platform Subscription (6 events)</span>
                  <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full font-bold">{slide.content.pricing?.subscription || '₹3,00,000/year'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Regular Subscription Cost</span>
                  <span className="line-through text-gray-500">{slide.content.pricing?.regularPrice || '₹4,50,000/year'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-bold text-gray-800">Your Savings</span>
                  <span className="text-green-600 font-bold text-xl">{slide.content.pricing?.savings || '₹1,50,000/year'}</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {slide.content.features.map((stat: any, index: number) => (
                <div key={index} className="bg-gradient-to-br from-pink-500 to-red-600 text-white p-3 sm:p-4 rounded-xl text-center shadow-lg">
                  <div className="text-lg sm:text-xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs opacity-90">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4">
                <h3 className="text-lg font-bold text-center">{slide.content.creativePricing?.title || 'Creative Services'}</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-800">All 6 Events (Annual)</span>
                  <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full font-bold">{slide.content.creativePricing?.annual || '₹1,00,000+GST/month'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Individual Event</span>
                  <span className="text-gray-800">{slide.content.creativePricing?.individual || '₹25,000+GST/month'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Short-term (3 months)</span>
                  <span className="text-gray-800">{slide.content.creativePricing?.shortTerm || '₹30,000+GST/month'}</span>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'benefits':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {slide.content.features.map((item: any, index: number) => (
                <motion.div 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-2xl sm:text-3xl mb-2">{item.icon}</div>
                  <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 rounded-2xl text-center shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-xl font-bold mb-2">Ready to Transform Your Event Experience?</h3>
              <p className="text-sm opacity-90">Join hundreds of successful events powered by EventForce and Veloscope</p>
            </motion.div>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <motion.div 
              className="flex justify-center items-center gap-6 mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-48 h-16 flex items-center justify-center">
                <img 
                  src="https://veloimages.s3.ap-south-1.amazonaws.com/Mangaluru%20Beach%20Festival%202025/proposal_logos/eventforce_logocolor.png" 
                  alt="EventForce Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="text-3xl text-gray-400">×</div>
              <div className="w-24 h-24 flex items-center justify-center">
                <img 
                  src="https://veloimages.s3.ap-south-1.amazonaws.com/Mangaluru%20Beach%20Festival%202025/proposal_logos/Veloscope_Logo%201.png" 
                  alt="Veloscope Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </motion.div>

            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Next Steps</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {slide.content.nextSteps.map((item: any, index: number) => (
                  <motion.div 
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="text-2xl sm:text-3xl mb-2">{item.icon}</div>
                    <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 rounded-2xl text-center shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-2">Ready to Elevate Maha Marathon Experience?</h2>
              <p className="text-base mb-4 opacity-90">Let's create something extraordinary together</p>
              <motion.button 
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 flex items-center mx-auto shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Check className="h-5 w-5 mr-2" />
                Complete Presentation
              </motion.button>
              
              <div className="mt-4 text-xs opacity-80 space-y-1">
                <p>📧 Contact: {slide.content.contact.email} | 📞 Call: {slide.content.contact.phone}</p>
                <p>🌐 {slide.content.contact.websites.join(' | ')}</p>
              </div>
            </motion.div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{slide.title}</h3>
            <p className="text-gray-600">{slide.subtitle}</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center relative overflow-hidden bg-transparent">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-90" />
      </div>
      
      <div className="relative max-w-[1400px] w-[98vw] sm:w-[95vw] min-w-[280px] mx-auto rounded-2xl sm:rounded-3xl overflow-visible shadow-2xl flex flex-col items-center justify-center">
        {/* Main content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-purple-400/50 w-full h-full flex flex-col justify-between items-center group p-2 sm:p-3 md:p-6"
              style={{ 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 32px 4px rgba(167, 139, 250, 0.3)',
                animation: 'glow 2.5s ease-in-out infinite alternate'
              }}
            >
              {/* Header */}
              <div className="text-center mb-2 sm:mb-3 flex-shrink-0">
                <motion.h1 
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {slide.title}
                </motion.h1>
                <motion.p 
                  className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.subtitle}
                </motion.p>
              </div>
              
              {/* Content */}
              <motion.div 
                className="flex-1 w-full flex flex-col items-center justify-start px-1 sm:px-2 md:px-4 overflow-y-auto overflow-x-hidden scrollbar-hide py-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {renderSlideContent(slide)}
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-200/50 w-full flex-shrink-0" style={{ minHeight: '50px' }}>
                <motion.button
                  onClick={() => currentSlide > 0 && setCurrentSlide(currentSlide - 1)}
                  disabled={currentSlide === 0}
                  className="flex items-center px-2 sm:px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-xs sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </motion.button>

                {/* Progress Bar */}
                <div className="flex-1 mx-3 flex flex-col items-center">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    {slides.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${
                          index === currentSlide
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg scale-110'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>

                {currentSlide === slides.length - 1 ? (
                  <motion.button
                    onClick={onComplete}
                    className="flex items-center px-2 sm:px-3 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Complete</span>
                    <span className="sm:hidden">Done</span>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => setCurrentSlide(currentSlide + 1)}
                    className="flex items-center px-2 sm:px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Animated border glow */}
      <style>{`
        @keyframes glow {
          0% { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 16px 2px rgba(167, 139, 250, 0.3); }
          100% { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 32px 4px rgba(167, 139, 250, 0.5); }
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
} 