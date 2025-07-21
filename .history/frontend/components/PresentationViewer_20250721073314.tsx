'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-4xl mb-4">🏃‍♂️</div>
          <h3 className="text-xl font-bold mb-2">Current Partnership</h3>
          <p className="text-gray-600">Successfully managing photography and videography for Maha Marathon series across Maharashtra</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold mb-2">Next Evolution</h3>
          <p className="text-gray-600">Introducing comprehensive event management platform with AI-powered solutions</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2">Complete Solution</h3>
          <p className="text-gray-600">From registration to post-event engagement - all in one integrated platform</p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "EventForce Platform",
    subtitle: "Complete Digital Backbone for Event Management",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="text-3xl mb-4">📋</div>
          <h3 className="text-xl font-bold mb-2">Smart Registration System</h3>
          <p className="text-gray-600">Seamless participant registration with payment gateway integration. Only ₹10 per participant for EventForce subscribers vs ₹25 for regular users</p>
        </div>
        <div className="card">
          <div className="text-3xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2">AI-Powered Support Desk</h3>
          <p className="text-gray-600">24/7 automated customer support with intelligent query resolution and escalation to human agents when needed</p>
        </div>
        <div className="card">
          <div className="text-3xl mb-4">💬</div>
          <h3 className="text-xl font-bold mb-2">Omni-Channel Messaging</h3>
          <p className="text-gray-600">Unified console for WhatsApp, SMS, Email, Facebook, Instagram with hyper-personalized messaging and campaign tracking</p>
        </div>
        <div className="card">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">Customer Data Platform</h3>
          <p className="text-gray-600">Advanced CRM with participant history, performance analytics, and pre-built query filters for targeted engagement</p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Veloscope Creative Solutions",
    subtitle: "Strategic Marketing & Brand Amplification",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="text-3xl mb-4">🎨</div>
          <h3 className="text-xl font-bold mb-2">Social Media Strategy</h3>
          <p className="text-gray-600">Comprehensive social media calendar, content creation, and strategic posting (3 posts/week per event)</p>
        </div>
        <div className="card">
          <div className="text-3xl mb-4">📸</div>
          <h3 className="text-xl font-bold mb-2">Photography & Video</h3>
          <p className="text-gray-600">Continued excellence in event photography with advanced face and BIB tagging at ₹1.25 per image (vs ₹2.50 regular)</p>
        </div>
        <div className="card">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2">Campaign Management</h3>
          <p className="text-gray-600">Pre and post-event content-driven campaigns with organic and paid promotion strategies</p>
        </div>
        <div className="card">
          <div className="text-3xl mb-4">📱</div>
          <h3 className="text-xl font-bold mb-2">Content Creation</h3>
          <p className="text-gray-600">Engaging visual content, reels, and promotional materials designed specifically for marathon events</p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Investment & Pricing",
    subtitle: "Exclusive Lokmat Partnership Pricing",
    content: (
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-xl font-bold mb-4 text-center">EventForce Platform - Special Lokmat Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
              <div className="text-2xl font-bold">₹3,00,000/year</div>
              <div className="text-sm">Platform Subscription (6 events)</div>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <div className="text-lg line-through text-gray-500">₹4,50,000/year</div>
              <div className="text-sm">Regular Subscription Cost</div>
            </div>
            <div className="p-4 bg-green-100 rounded-lg">
              <div className="text-xl font-bold text-green-600">₹1,50,000/year</div>
              <div className="text-sm">Your Savings</div>
            </div>
          </div>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-4 text-center">Veloscope Social Media Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg">
              <div className="text-xl font-bold">₹1,00,000+GST/month</div>
              <div className="text-sm">All 6 Events (Annual)</div>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <div className="text-lg">₹25,000+GST/month</div>
              <div className="text-sm">Individual Event</div>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <div className="text-lg">₹30,000+GST/month</div>
              <div className="text-sm">Short-term (3 months)</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Why Choose This Partnership?",
    subtitle: "Transforming Events, Amplifying Success",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="text-3xl mb-4">🏆</div>
          <h3 className="text-xl font-bold mb-2">Proven Track Record</h3>
          <p className="text-gray-600">Years of successful partnership in photography and videography for Maha Marathon series</p>
        </div>
        <div className="card">
          <div className="text-3xl mb-4">💰</div>
          <h3 className="text-xl font-bold mb-2">Significant Cost Savings</h3>
          <p className="text-gray-600">33% discount on platform subscription + preferential pricing on all services</p>
        </div>
        <div className="card">
          <div className="text-3xl mb-4">🔧</div>
          <h3 className="text-xl font-bold mb-2">End-to-End Solution</h3>
          <p className="text-gray-600">Single point of contact for all technology and creative needs</p>
        </div>
        <div className="card">
          <div className="text-3xl mb-4">📈</div>
          <h3 className="text-xl font-bold mb-2">Data-Driven Growth</h3>
          <p className="text-gray-600">Enhanced participant engagement and retention through smart CRM and analytics</p>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Let's Make Maha Marathon Extraordinary",
    subtitle: "Your Success is Our Mission",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Next Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">Partnership Discussion</h3>
              <p className="text-gray-600">Detailed discussion about your specific requirements and customization needs</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-4">💻</div>
              <h3 className="text-xl font-bold mb-2">Book a live demo</h3>
              <p className="text-gray-600">Hands-on demonstration of EventForce platform and Veloscope creative solutions</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">Proposal & Contract</h3>
              <p className="text-gray-600">Customized proposal with detailed scope, timeline, and implementation plan</p>
            </div>
          </div>
        </div>
        <div className="card text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Elevate Maha Marathon Experience?</h2>
          <p className="text-lg mb-4">Let's create something extraordinary together</p>
          <button 
            onClick={onComplete}
            className="btn-primary bg-white text-blue-600 hover:bg-gray-100"
          >
            <Check className="h-5 w-5 mr-2" />
            Complete Presentation
          </button>
        </div>
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="card"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{slide.title}</h1>
              <p className="text-xl text-gray-600">{slide.subtitle}</p>
            </div>
            
            <div className="mb-8">
              {slide.content}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </button>

              <div className="text-sm text-gray-500">
                {currentSlide + 1} of {slides.length}
              </div>

              <button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 