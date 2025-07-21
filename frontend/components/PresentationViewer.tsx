'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Star, Clock, Users, TrendingUp } from 'lucide-react';

// Particle background for extra wow
function ParticleBackground() {
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    const particles: {x: number, y: number, r: number, dx: number, dy: number, o: number}[] = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        o: 0.2 + Math.random() * 0.3
      });
    }
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(80, 80, 200, ${p.o})`;
        ctx.shadowColor = '#a78bfa';
        ctx.shadowBlur = 8;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  return <canvas id="particle-canvas" className="fixed inset-0 w-full h-full z-0 pointer-events-none" style={{opacity:0.18}} />;
}

// Custom parallax background component
const ParallaxBackground = ({ children, speed = 0.5 }: { children: React.ReactNode; speed?: number }) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrollTop = window.pageYOffset;
        setOffset(scrollTop * speed);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div 
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
};

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
    background: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-90" />
        <ParallaxBackground speed={0.3}>
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-pink-400/30 to-blue-400/30 rounded-full blur-3xl animate-float2" />
        </ParallaxBackground>
        <ParallaxBackground speed={0.5}>
          <div className="absolute top-1/2 left-1/3 text-8xl opacity-10 animate-float">🏃‍♂️</div>
        </ParallaxBackground>
      </div>
    ),
    content: (
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
          {[
            { icon: "🏃‍♂️", title: "Current Partnership", desc: "Successfully managing photography and videography for Maha Marathon series across Maharashtra" },
            { icon: "🚀", title: "Next Evolution", desc: "Introducing comprehensive event management platform with AI-powered solutions" },
            { icon: "🎯", title: "Complete Solution", desc: "From registration to post-event engagement - all in one integrated platform" }
          ].map((item, index) => (
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

        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 rounded-2xl text-center shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-bold mb-2">Ready to revolutionize your event management?</h3>
          <p className="text-sm opacity-90">Let's take Maha Marathon to the next level with cutting-edge technology and creative excellence</p>
        </motion.div>
      </div>
    )
  },
  {
    id: 2,
    title: "EventForce Platform",
    subtitle: "Complete Digital Backbone for Event Management",
    background: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 opacity-90" />
        <ParallaxBackground speed={0.4}>
          <svg className="absolute w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="lines" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M0,60 l60,-60 M-15,15 l30,-30 M45,75 l30,-30" stroke="#a78bfa" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lines)" />
          </svg>
        </ParallaxBackground>
        <ParallaxBackground speed={0.2}>
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse" />
        </ParallaxBackground>
      </div>
    ),
    content: (
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
          {[
            { icon: "📋", title: "Smart Registration System", desc: "Seamless participant registration with payment gateway integration. Only ₹10 per participant for EventForce subscribers vs ₹25 for regular users" },
            { icon: "🤖", title: "AI-Powered Support Desk", desc: "24/7 automated customer support with intelligent query resolution and escalation to human agents when needed" },
            { icon: "💬", title: "Omni-Channel Messaging", desc: "Unified console for WhatsApp, SMS, Email, Facebook, Instagram with hyper-personalized messaging and campaign tracking" },
            { icon: "📊", title: "Customer Data Platform", desc: "Advanced CRM with participant history, performance analytics, and pre-built query filters for targeted engagement" },
            { icon: "☁️", title: "Secure Cloud Storage", desc: "3TB storage for all event data with easy access, classification, and retrieval through a unified interface" },
            { icon: "📈", title: "Real-time Dashboards", desc: "Event-specific status dashboards with role-based access for efficient task management and decision making" }
          ].map((item, index) => (
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
    )
  },
  {
    id: 3,
    title: "Veloscope Creative Solutions",
    subtitle: "Strategic Marketing & Brand Amplification",
    background: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-blue-50 opacity-90" />
        <ParallaxBackground speed={0.3}>
          <div className="absolute top-1/4 left-1/3 text-9xl opacity-15 animate-float">🎨</div>
          <div className="absolute bottom-1/4 right-1/4 text-9xl opacity-15 animate-float2">📸</div>
        </ParallaxBackground>
      </div>
    ),
    content: (
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
          {[
            { icon: "🎨", title: "Social Media Strategy", desc: "Comprehensive social media calendar, content creation, and strategic posting (3 posts/week per event)" },
            { icon: "📸", title: "Photography & Video", desc: "Continued excellence in event photography with advanced face and BIB tagging at ₹1.25 per image (vs ₹2.50 regular)" },
            { icon: "🎯", title: "Campaign Management", desc: "Pre and post-event content-driven campaigns with organic and paid promotion strategies" },
            { icon: "📱", title: "Content Creation", desc: "Engaging visual content, reels, and promotional materials designed specifically for marathon events" },
            { icon: "📊", title: "Analytics & Tracking", desc: "Detailed performance analytics and ROI tracking for all marketing initiatives" },
            { icon: "🎬", title: "Production Support", desc: "Optional production crew deployment for special shoots and promotional videos at pre-agreed rates" }
          ].map((item, index) => (
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
    )
  },
  {
    id: 4,
    title: "Investment & Pricing",
    subtitle: "Exclusive Lokmat Partnership Pricing",
    background: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50 opacity-90" />
        <ParallaxBackground speed={0.2}>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-yellow-300/30 to-orange-300/30 rounded-full blur-3xl animate-pulse" />
        </ParallaxBackground>
      </div>
    ),
    content: (
      <div className="space-y-4">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4">
            <h3 className="text-lg font-bold text-center">EventForce Platform - Special Lokmat Pricing</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-800">Platform Subscription (6 events)</span>
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full font-bold">₹3,00,000/year</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Regular Subscription Cost</span>
              <span className="line-through text-gray-500">₹4,50,000/year</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-gray-800">Your Savings</span>
              <span className="text-green-600 font-bold text-xl">₹1,50,000/year</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { value: "3TB", label: "Cloud Storage" },
            { value: "18,000", label: "Message Credits/Year" },
            { value: "₹1.20", label: "Per Additional Message" },
            { value: "₹1.25", label: "Per Image Tagging" }
          ].map((stat, index) => (
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
            <h3 className="text-lg font-bold text-center">Veloscope Social Media Services</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-800">All 6 Events (Annual)</span>
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full font-bold">₹1,00,000+GST/month</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Individual Event</span>
              <span className="text-gray-800">₹25,000+GST/month</span>
            </div>
            <div className="flex justify-between items-center py-2">
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
    background: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-90" />
        <ParallaxBackground speed={0.3}>
          <div className="absolute top-1/3 left-1/4 text-9xl opacity-15 animate-float">📈</div>
          <div className="absolute bottom-1/3 right-1/4 text-9xl opacity-15 animate-float2">🏆</div>
        </ParallaxBackground>
      </div>
    ),
    content: (
      <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { icon: "🏆", title: "Proven Track Record", desc: "Years of successful partnership in photography and videography for Maha Marathon series" },
            { icon: "💰", title: "Significant Cost Savings", desc: "33% discount on platform subscription + preferential pricing on all services" },
            { icon: "🔧", title: "End-to-End Solution", desc: "Single point of contact for all technology and creative needs" },
            { icon: "📈", title: "Data-Driven Growth", desc: "Enhanced participant engagement and retention through smart CRM and analytics" },
            { icon: "⚡", title: "Operational Efficiency", desc: "Streamlined processes reducing manual work and increasing productivity" },
            { icon: "🎯", title: "Brand Amplification", desc: "Strategic marketing approach to enhance Maha Marathon's reach and impact" }
          ].map((item, index) => (
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
    )
  },
  {
    id: 6,
    title: "Let's Make Maha Marathon Extraordinary",
    subtitle: "Your Success is Our Mission",
    background: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 opacity-90" />
        <ParallaxBackground speed={0.2}>
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-green-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" />
        </ParallaxBackground>
      </div>
    ),
    content: (
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
            {[
              { icon: "🤝", title: "Partnership Discussion", desc: "Detailed discussion about your specific requirements and customization needs" },
              { icon: "💻", title: "Book a live demo", desc: "Hands-on demonstration of EventForce platform and Veloscope creative solutions" },
              { icon: "📝", title: "Proposal & Contract", desc: "Customized proposal with detailed scope, timeline, and implementation plan" }
            ].map((item, index) => (
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

  // Refs and state for perfect fit calculation
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [contentScale, setContentScale] = useState(1);
  const [isScaled, setIsScaled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  // Calculate perfect fit dimensions
  useEffect(() => {
    const calculateDimensions = () => {
      // Get the actual available space for the presentation
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const availableHeight = Math.max(500, viewportHeight - 100); // Increased buffer for mobile
      
      setContainerHeight(availableHeight);
      
      // Calculate content scaling if needed - be more lenient with scaling
      if (contentRef.current && containerRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        const availableContentHeight = availableHeight - 160; // Increased buffer for mobile
        
        // Only scale if content is significantly larger - be more lenient on mobile
        const mobileCheck = viewportWidth < 768;
        setIsMobile(mobileCheck);
        const scaleThreshold = mobileCheck ? 1.2 : 1.05; // Higher threshold on mobile
        const minScale = mobileCheck ? 0.8 : 0.7; // Higher min scale on mobile
        
        if (contentHeight > availableContentHeight * scaleThreshold) {
          const scale = Math.max(minScale, availableContentHeight / contentHeight);
          setContentScale(scale);
          setIsScaled(true);
          setShowScrollHint(true);
        } else {
          setContentScale(1);
          setIsScaled(false);
          // Check if content is still scrollable even without scaling
          setShowScrollHint(contentHeight > availableContentHeight);
        }
    }
  };

    // Initial calculation
    calculateDimensions();
    
    // Recalculate on resize and slide change
    const resizeObserver = new ResizeObserver(calculateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener('resize', calculateDimensions);
    
    // Add scroll listener to hide hint after scrolling
    const handleScroll = () => {
      if (showScrollHint) {
        setShowScrollHint(false);
      }
    };
    
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateDimensions);
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentSlide]);

  return (
    <div className="w-full h-screen flex justify-center items-center relative overflow-hidden bg-transparent">
      {/* Particle background for extra wow */}
      <ParticleBackground />
      
      <div
        ref={containerRef}
        className="relative max-w-[1400px] w-[98vw] sm:w-[95vw] min-w-[280px] mx-auto rounded-2xl sm:rounded-3xl overflow-visible shadow-2xl flex flex-col items-center justify-center"
        style={{ height: containerHeight, minHeight: '500px', maxHeight: '95vh' }}
      >
        {/* Dynamic parallax background */}
        {slide.background}
        
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
              {/* Header - Fixed height */}
              <div className="text-center mb-2 sm:mb-3 flex-shrink-0">
              <motion.h1 
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  title={slide.title}
              >
                {slide.title}
              </motion.h1>
              <motion.p 
                  className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  title={slide.subtitle}
              >
                {slide.subtitle}
              </motion.p>
            </div>
            
              {/* Content - Flexible height with optimized scaling */}
            <motion.div 
                ref={contentRef}
                className="flex-1 w-full flex flex-col items-center justify-start px-1 sm:px-2 md:px-4 overflow-y-auto overflow-x-hidden scrollbar-hide py-2"
                initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ 
                  transform: `scale(${contentScale})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                  maxHeight: 'calc(100% - 120px)', // Reserve space for header and navigation
                  scrollBehavior: 'smooth'
                }}
            >
              {slide.content}
                
                {/* Scaling indicator - only show if significantly scaled */}
                {isScaled && contentScale < 0.9 && (
                  <div className="absolute top-2 right-2 flex items-center text-xs text-purple-600 bg-white/90 px-2 py-1 rounded-full shadow-md" title="Content scaled to fit screen">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h6M4 4v6M4 4l6 6M20 20h-6M20 20v-6M20 20l-6-6" />
                    </svg>
                    Scaled
                  </div>
                )}
                
                {/* Scroll indicator for mobile */}
                {isMobile && showScrollHint && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full shadow-md animate-bounce">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                    </svg>
                    Scroll
                  </div>
                )}
                
                {/* Fade effect at bottom for mobile */}
                {isMobile && showScrollHint && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent pointer-events-none"></div>
                )}
            </motion.div>

              {/* Navigation - Fixed height */}
              <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-200/50 w-full flex-shrink-0" style={{ minHeight: '50px' }}>
              <motion.button
                  onClick={() => currentSlide > 0 && setCurrentSlide(currentSlide - 1)}
                disabled={currentSlide === 0}
                  className="flex items-center px-2 sm:px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-xs sm:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                  title="Previous Slide"
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
                        title={`Go to slide ${index + 1}`}
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
                    title="Complete Presentation"
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
                    title="Next Slide"
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
        
        /* Custom scrollbar styles */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Smooth scrolling for mobile */
        @media (max-width: 768px) {
          .scrollbar-hide {
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
} 