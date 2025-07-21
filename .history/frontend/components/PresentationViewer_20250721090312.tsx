'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Star, Clock, Users, TrendingUp } from 'lucide-react';

interface PresentationViewerProps {
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    title: "Transforming Maha Marathon Experience",
    subtitle: "Complete Digital Event Management & Marketing Solution",
    content: (
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Logo Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 lg:gap-8 mb-3 sm:mb-4 lg:mb-6">
          <div className="text-center">
            <div className="w-32 sm:w-40 lg:w-48 h-12 sm:h-14 lg:h-16 flex items-center justify-center mb-2">
              <img 
                src="https://veloimages.s3.ap-south-1.amazonaws.com/Mangaluru%20Beach%20Festival%202025/proposal_logos/eventforce_logocolor.png" 
                alt="EventForce Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-orange-600 font-semibold text-xs sm:text-sm">Technology Platform</div>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl text-gray-400">+</div>
          <div className="text-center">
            <div className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 flex items-center justify-center mb-2">
              <img 
                src="https://veloimages.s3.ap-south-1.amazonaws.com/Mangaluru%20Beach%20Festival%202025/proposal_logos/Veloscope_Logo%201.png" 
                alt="Veloscope Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="font-bold text-gray-800 text-sm sm:text-base">veloscope</div>
            <div className="text-green-600 font-semibold text-xs sm:text-sm">Creative Solutions</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <motion.div 
            className="card text-center hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">🏃‍♂️</div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 text-gray-800">Current Partnership</h3>
            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm lg:text-base">Successfully managing photography and videography for Maha Marathon series across Maharashtra</p>
          </motion.div>
          
          <motion.div 
            className="card text-center hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">🚀</div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 text-gray-800">Next Evolution</h3>
            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm lg:text-base">Introducing comprehensive event management platform with AI-powered solutions</p>
          </motion.div>
          
          <motion.div 
            className="card text-center hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">🎯</div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 text-gray-800">Complete Solution</h3>
            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm lg:text-base">From registration to post-event engagement - all in one integrated platform</p>
          </motion.div>
        </div>

        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-3 sm:p-4 lg:p-6 rounded-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2">Ready to revolutionize your event management?</h3>
          <p className="text-xs sm:text-sm lg:text-base opacity-90">Let's take Maha Marathon to the next level with cutting-edge technology and creative excellence</p>
        </motion.div>
      </div>
    )
  },
  {
    id: 2,
    title: "EventForce Platform",
    subtitle: "Complete Digital Backbone for Event Management",
    content: (
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-40 sm:w-48 h-12 sm:h-16 flex items-center justify-center">
            <img 
              src="https://veloimages.s3.ap-south-1.amazonaws.com/Mangaluru%20Beach%20Festival%202025/proposal_logos/eventforce_logocolor.png" 
              alt="EventForce Logo"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📋</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">Smart Registration System</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">Seamless participant registration with payment gateway integration. Only <span className="font-bold text-green-600">₹10 per participant</span> for EventForce subscribers vs ₹25 for regular users</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🤖</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">AI-Powered Support Desk</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">24/7 automated customer support with intelligent query resolution and escalation to human agents when needed</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">💬</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">Omni-Channel Messaging</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">Unified console for WhatsApp, SMS, Email, Facebook, Instagram with hyper-personalized messaging and campaign tracking</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📊</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">Customer Data Platform</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">Advanced CRM with participant history, performance analytics, and pre-built query filters for targeted engagement</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">☁️</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">Secure Cloud Storage</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">3TB storage for all event data with easy access, classification, and retrieval through a unified interface</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📈</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">Real-time Dashboards</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">Event-specific status dashboards with role-based access for efficient task management and decision making</p>
          </motion.div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Veloscope Creative Solutions",
    subtitle: "Strategic Marketing & Brand Amplification",
    content: (
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <div className="w-24 h-24 flex items-center justify-center mb-3">
              <img 
                src="https://veloimages.s3.ap-south-1.amazonaws.com/Mangaluru%20Beach%20Festival%202025/proposal_logos/Veloscope_Logo%201.png" 
                alt="Veloscope Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="font-bold text-gray-800 text-xl">veloscope</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Social Media Strategy</h3>
            <p className="text-gray-600 leading-relaxed">Comprehensive social media calendar, content creation, and strategic posting (3 posts/week per event)</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Photography & Video</h3>
            <p className="text-gray-600 leading-relaxed">Continued excellence in event photography with advanced face and BIB tagging at <span className="font-bold text-green-600">₹1.25 per image</span> (vs ₹2.50 regular)</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Campaign Management</h3>
            <p className="text-gray-600 leading-relaxed">Pre and post-event content-driven campaigns with organic and paid promotion strategies</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Content Creation</h3>
            <p className="text-gray-600 leading-relaxed">Engaging visual content, reels, and promotional materials designed specifically for marathon events</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Analytics & Tracking</h3>
            <p className="text-gray-600 leading-relaxed">Detailed performance analytics and ROI tracking for all marketing initiatives</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Production Support</h3>
            <p className="text-gray-600 leading-relaxed">Optional production crew deployment for special shoots and promotional videos at pre-agreed rates</p>
          </motion.div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Investment & Pricing",
    subtitle: "Exclusive Lokmat Partnership Pricing",
    content: (
      <div className="space-y-8">
        {/* EventForce Pricing */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-t-xl">
            <h3 className="text-xl font-bold text-center">EventForce Platform - Special Lokmat Pricing</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="font-semibold text-gray-800">Platform Subscription (6 events)</span>
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full font-bold">₹3,00,000/year</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Regular Subscription Cost</span>
              <span className="line-through text-gray-500">₹4,50,000/year</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="font-bold text-gray-800">Your Savings</span>
              <span className="text-green-600 font-bold text-lg">₹1,50,000/year</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-pink-400 to-red-500 text-white p-6 rounded-xl text-center">
            <div className="text-3xl font-bold mb-2">3TB</div>
            <div className="text-sm opacity-90">Cloud Storage</div>
          </div>
          <div className="bg-gradient-to-r from-pink-400 to-red-500 text-white p-6 rounded-xl text-center">
            <div className="text-3xl font-bold mb-2">18,000</div>
            <div className="text-sm opacity-90">Message Credits/Year</div>
          </div>
          <div className="bg-gradient-to-r from-pink-400 to-red-500 text-white p-6 rounded-xl text-center">
            <div className="text-3xl font-bold mb-2">₹1.20</div>
            <div className="text-sm opacity-90">Per Additional Message</div>
          </div>
          <div className="bg-gradient-to-r from-pink-400 to-red-500 text-white p-6 rounded-xl text-center">
            <div className="text-3xl font-bold mb-2">₹1.25</div>
            <div className="text-sm opacity-90">Per Image Tagging</div>
          </div>
        </motion.div>

        {/* Veloscope Pricing */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-xl">
            <h3 className="text-xl font-bold text-center">Veloscope Social Media Services</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="font-semibold text-gray-800">All 6 Events (Annual)</span>
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full font-bold">₹1,00,000+GST/month</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Individual Event</span>
              <span className="text-gray-800">₹25,000+GST/month</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Short-term (3 months)</span>
              <span className="text-gray-800">₹30,000+GST/month</span>
            </div>
          </div>
        </motion.div>
      </div>
    )
  },
  {
    id: 5,
    title: "Why Choose This Partnership?",
    subtitle: "Transforming Events, Amplifying Success",
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Proven Track Record</h3>
            <p className="text-gray-600 leading-relaxed">Years of successful partnership in photography and videography for Maha Marathon series</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Significant Cost Savings</h3>
            <p className="text-gray-600 leading-relaxed">33% discount on platform subscription + preferential pricing on all services</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">End-to-End Solution</h3>
            <p className="text-gray-600 leading-relaxed">Single point of contact for all technology and creative needs</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Data-Driven Growth</h3>
            <p className="text-gray-600 leading-relaxed">Enhanced participant engagement and retention through smart CRM and analytics</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Operational Efficiency</h3>
            <p className="text-gray-600 leading-relaxed">Streamlined processes reducing manual work and increasing productivity</p>
          </motion.div>
          
          <motion.div 
            className="card hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Brand Amplification</h3>
            <p className="text-gray-600 leading-relaxed">Strategic marketing approach to enhance Maha Marathon's reach and impact</p>
          </motion.div>
        </div>

        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 rounded-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Event Experience?</h3>
          <p className="text-lg opacity-90">Join hundreds of successful events powered by EventForce and Veloscope</p>
        </motion.div>
      </div>
    )
  },
  {
    id: 6,
    title: "Let's Make Maha Marathon Extraordinary",
    subtitle: "Your Success is Our Mission",
    content: (
      <div className="space-y-8">
        {/* Logo Section */}
        <div className="flex justify-center items-center gap-8 mb-8">
          <div className="w-48 h-16 flex items-center justify-center">
            <img 
              src="https://veloimages.s3.ap-south-1.amazonaws.com/Mangaluru%20Beach%20Festival%202025/proposal_logos/eventforce_logocolor.png" 
              alt="EventForce Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="text-4xl text-gray-400">×</div>
          <div className="w-24 h-24 flex items-center justify-center">
            <img 
              src="https://veloimages.s3.ap-south-1.amazonaws.com/Mangaluru%20Beach%20Festival%202025/proposal_logos/Veloscope_Logo%201.png" 
              alt="Veloscope Logo"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Next Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="card text-center hover:scale-105 transition-transform duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Partnership Discussion</h3>
              <p className="text-gray-600 leading-relaxed">Detailed discussion about your specific requirements and customization needs</p>
            </motion.div>
            
            <motion.div 
              className="card text-center hover:scale-105 transition-transform duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Book a live demo</h3>
              <p className="text-gray-600 leading-relaxed">Hands-on demonstration of EventForce platform and Veloscope creative solutions</p>
            </motion.div>
            
            <motion.div 
              className="card text-center hover:scale-105 transition-transform duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Proposal & Contract</h3>
              <p className="text-gray-600 leading-relaxed">Customized proposal with detailed scope, timeline, and implementation plan</p>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 rounded-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Maha Marathon Experience?</h2>
          <p className="text-xl mb-6 opacity-90">Let's create something extraordinary together</p>
          <motion.button 
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 flex items-center mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Check className="h-6 w-6 mr-3" />
            Complete Presentation
          </motion.button>
          
          <div className="mt-8 text-sm opacity-80">
            <p>📧 Contact: support@veloscope.in | 📞 Call: +91-8304033534</p>
            <p>🌐 https://velotales.veloscope.in | https://website.eventforce.ai</p>
          </div>
        </motion.div>
      </div>
    )
  }
];

export default function PresentationViewer({ currentSlide, setCurrentSlide, onComplete }: PresentationViewerProps) {
  const slide = slides[currentSlide];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = () => {
    if (currentSlide === slides.length - 1) {
      onComplete();
    }
  };

  return (
    <div className="max-w-8xl mx-auto">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="card min-h-[350px] sm:min-h-[400px] lg:min-h-[500px]"
          >
            <div className="text-center mb-3 sm:mb-4 lg:mb-6">
              <motion.h1 
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3 bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {slide.title}
              </motion.h1>
              <motion.p 
                className="text-sm sm:text-base lg:text-xl text-gray-600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {slide.subtitle}
              </motion.p>
            </div>
            
            <motion.div 
              className="mb-3 sm:mb-4 lg:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {slide.content}
            </motion.div>

            <div className="flex justify-between items-center pt-4 sm:pt-6 lg:pt-8 border-t border-gray-200">
              <motion.button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Previous</span>
              </motion.button>

              <div className="flex items-center space-x-1 sm:space-x-2">
                {slides.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
                      index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>

              {currentSlide === slides.length - 1 ? (
                <motion.button
                  onClick={handleComplete}
                  className="btn-primary flex items-center text-xs sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Complete</span>
                </motion.button>
              ) : (
                <motion.button
                  onClick={nextSlide}
                  className="btn-secondary flex items-center text-xs sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 ml-1 sm:ml-2" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 