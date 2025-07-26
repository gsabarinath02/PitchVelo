'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Edit, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Eye,
  EyeOff,
  Palette,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Monitor,
  Smartphone,
  Tablet,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Type,
  Image,
  Settings,
  Layout,
  FileText,
  Sparkles,
  Droplets,
  Sun,
  Moon
} from 'lucide-react';

import { SlideContent } from '@/lib/api';
import EnhancedSlidePreview from './EnhancedSlidePreview';
import EnhancedStylePanel from './EnhancedStylePanel';

interface FlipCardSlideEditorProps {
  slides: SlideContent[];
  onSave: (slides: SlideContent[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Default Maha Marathon presentation slides
const defaultMahaMarathonSlides: SlideContent[] = [
  {
    id: 1,
    title: "Transforming Maha Marathon Experience",
    subtitle: "Complete Digital Event Management & Marketing Solution",
    content: {
      type: "welcome",
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
    title: "Get Started Today",
    subtitle: "Ready to Transform Your Events?",
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

const slideTypes = [
  { value: 'welcome', label: 'Welcome', icon: '👋', desc: 'Introduction slide with key highlights' },
  { value: 'platform', label: 'Platform', icon: '💻', desc: 'Showcase your product or service features' },
  { value: 'creative', label: 'Creative', icon: '🎨', desc: 'Creative services and solutions' },
  { value: 'pricing', label: 'Pricing', icon: '💰', desc: 'Pricing plans and packages' },
  { value: 'benefits', label: 'Benefits', icon: '🎯', desc: 'Why choose your solution' },
  { value: 'cta', label: 'Call to Action', icon: '📞', desc: 'Contact information and next steps' },
  { value: 'testimonial', label: 'Testimonial', icon: '💬', desc: 'Customer testimonials and reviews' },
  { value: 'timeline', label: 'Timeline', icon: '📅', desc: 'Project timeline and milestones' },
  { value: 'team', label: 'Team', icon: '👥', desc: 'Team members and expertise' },
  { value: 'custom', label: 'Custom', icon: '⚙️', desc: 'Custom slide with flexible content' }
];

export default function FlipCardSlideEditor({ 
  slides, 
  onSave, 
  onCancel, 
  isLoading = false 
}: FlipCardSlideEditorProps) {
  const [editedSlides, setEditedSlides] = useState<SlideContent[]>(
    slides.length > 0 ? slides : defaultMahaMarathonSlides
  );
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideStyles, setSlideStyles] = useState({
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    accentColor: '#f59e0b',
    borderRadius: '12px',
    shadow: '0 10px 25px rgba(0,0,0,0.1)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    animation: 'none',
    opacity: 1
  });

  const selectedSlide = editedSlides[selectedSlideIndex];

  const updateSlide = (field: keyof SlideContent, value: any) => {
    const newSlides = [...editedSlides];
    newSlides[selectedSlideIndex] = {
      ...newSlides[selectedSlideIndex],
      [field]: value
    };
    setEditedSlides(newSlides);
  };

  const updateSlideContent = (field: string, value: any) => {
    const newSlides = [...editedSlides];
    newSlides[selectedSlideIndex] = {
      ...newSlides[selectedSlideIndex],
      content: {
        ...newSlides[selectedSlideIndex].content,
        [field]: value
      }
    };
    setEditedSlides(newSlides);
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newSlides = [...editedSlides];
    const features = [...(newSlides[selectedSlideIndex].content.features || [])];
    features[index] = {
      ...features[index],
      [field]: value
    };
    updateSlideContent('features', features);
  };

  const addFeature = () => {
    const newFeature = { icon: "✨", title: "New Feature", desc: "Feature description" };
    const features = [...(selectedSlide.content.features || []), newFeature];
    updateSlideContent('features', features);
  };

  const removeFeature = (index: number) => {
    const features = selectedSlide.content.features?.filter((_: any, i: number) => i !== index) || [];
    updateSlideContent('features', features);
  };

  const addSlide = () => {
    const newSlide: SlideContent = {
      id: Date.now(),
      title: "New Slide",
      subtitle: "Slide subtitle",
      content: {
        type: 'welcome',
        features: [{ icon: "✨", title: "New Feature", desc: "Feature description" }]
      }
    };
    setEditedSlides([...editedSlides, newSlide]);
    setSelectedSlideIndex(editedSlides.length);
  };

  const removeSlide = (index: number) => {
    if (editedSlides.length > 1) {
      const newSlides = editedSlides.filter((_: SlideContent, i: number) => i !== index);
      setEditedSlides(newSlides);
      if (selectedSlideIndex >= newSlides.length) {
        setSelectedSlideIndex(newSlides.length - 1);
      }
    }
  };

  const renderSlideContentEditor = () => {
    const slideType = selectedSlide.content.type;

    switch (slideType) {
      case 'welcome':
      case 'platform':
      case 'creative':
      case 'benefits':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Features</h3>
                <p className="text-sm text-gray-600 mt-1">Add and edit the key features for this slide</p>
              </div>
              <button
                onClick={addFeature}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Feature</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedSlide.content.features?.map((feature: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{feature.icon}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Feature {index + 1}</span>
                    </div>
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      <input
                        type="text"
                        value={feature.icon}
                        onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="🎯"
                      />
                      <p className="text-xs text-gray-500 mt-1">Use emoji or text</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Feature title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={feature.desc}
                        onChange={(e) => updateFeature(index, 'desc', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        rows={3}
                        placeholder="Feature description"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform Pricing</h3>
              <p className="text-sm text-gray-600 mb-4">Configure the main platform pricing details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={selectedSlide.content.pricing?.title || ''}
                    onChange={(e) => updateSlideContent('pricing', {
                      ...selectedSlide.content.pricing,
                      title: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Platform Pricing Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Price</label>
                  <input
                    type="text"
                    value={selectedSlide.content.pricing?.subscription || ''}
                    onChange={(e) => updateSlideContent('pricing', {
                      ...selectedSlide.content.pricing,
                      subscription: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="₹3,00,000/year"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Regular Price</label>
                  <input
                    type="text"
                    value={selectedSlide.content.pricing?.regularPrice || ''}
                    onChange={(e) => updateSlideContent('pricing', {
                      ...selectedSlide.content.pricing,
                      regularPrice: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="₹4,50,000/year"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Savings</label>
                  <input
                    type="text"
                    value={selectedSlide.content.pricing?.savings || ''}
                    onChange={(e) => updateSlideContent('pricing', {
                      ...selectedSlide.content.pricing,
                      savings: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="₹1,50,000/year"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Creative Services Pricing</h3>
              <p className="text-sm text-gray-600 mb-4">Configure creative services pricing options</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={selectedSlide.content.creativePricing?.title || ''}
                    onChange={(e) => updateSlideContent('creativePricing', {
                      ...selectedSlide.content.creativePricing,
                      title: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Creative Services Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Price</label>
                  <input
                    type="text"
                    value={selectedSlide.content.creativePricing?.annual || ''}
                    onChange={(e) => updateSlideContent('creativePricing', {
                      ...selectedSlide.content.creativePricing,
                      annual: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="₹1,00,000+GST/month"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Individual Price</label>
                  <input
                    type="text"
                    value={selectedSlide.content.creativePricing?.individual || ''}
                    onChange={(e) => updateSlideContent('creativePricing', {
                      ...selectedSlide.content.creativePricing,
                      individual: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="₹25,000+GST/month"
                  />
                </div>
              </div>
            </div>

            {/* Additional Pricing Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Features</h3>
              <p className="text-sm text-gray-600 mb-4">Configure additional pricing features and statistics</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cloud Storage</label>
                  <input
                    type="text"
                    value={selectedSlide.content.features?.[0]?.value || ''}
                    onChange={(e) => {
                      const features = [...(selectedSlide.content.features || [])];
                      if (features[0]) {
                        features[0] = { ...features[0], value: e.target.value };
                      } else {
                        features[0] = { value: e.target.value, label: 'Cloud Storage' };
                      }
                      updateSlideContent('features', features);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="3TB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Credits/Year</label>
                  <input
                    type="text"
                    value={selectedSlide.content.features?.[1]?.value || ''}
                    onChange={(e) => {
                      const features = [...(selectedSlide.content.features || [])];
                      if (features[1]) {
                        features[1] = { ...features[1], value: e.target.value };
                      } else {
                        features[1] = { value: e.target.value, label: 'Message Credits/Year' };
                      }
                      updateSlideContent('features', features);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="18,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Per Additional Message</label>
                  <input
                    type="text"
                    value={selectedSlide.content.features?.[2]?.value || ''}
                    onChange={(e) => {
                      const features = [...(selectedSlide.content.features || [])];
                      if (features[2]) {
                        features[2] = { ...features[2], value: e.target.value };
                      } else {
                        features[2] = { value: e.target.value, label: 'Per Additional Message' };
                      }
                      updateSlideContent('features', features);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="₹1.20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Per Image Tagging</label>
                  <input
                    type="text"
                    value={selectedSlide.content.features?.[3]?.value || ''}
                    onChange={(e) => {
                      const features = [...(selectedSlide.content.features || [])];
                      if (features[3]) {
                        features[3] = { ...features[3], value: e.target.value };
                      } else {
                        features[3] = { value: e.target.value, label: 'Per Image Tagging' };
                      }
                      updateSlideContent('features', features);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="₹1.25"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Steps</h3>
              <p className="text-sm text-gray-600 mb-4">Configure the call-to-action steps for your audience</p>
              <div className="space-y-4">
                {selectedSlide.content.nextSteps?.map((step: any, index: number) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                        <input
                          type="text"
                          value={step.icon}
                          onChange={(e) => {
                            const newSteps = [...(selectedSlide.content.nextSteps || [])];
                            newSteps[index] = { ...newSteps[index], icon: e.target.value };
                            updateSlideContent('nextSteps', newSteps);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="🤝"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const newSteps = [...(selectedSlide.content.nextSteps || [])];
                            newSteps[index] = { ...newSteps[index], title: e.target.value };
                            updateSlideContent('nextSteps', newSteps);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Step title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <input
                          type="text"
                          value={step.desc}
                          onChange={(e) => {
                            const newSteps = [...(selectedSlide.content.nextSteps || [])];
                            newSteps[index] = { ...newSteps[index], desc: e.target.value };
                            updateSlideContent('nextSteps', newSteps);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Step description"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
              <p className="text-sm text-gray-600 mb-4">Add your contact details for potential clients</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedSlide.content.contact?.email || ''}
                    onChange={(e) => updateSlideContent('contact', {
                      ...selectedSlide.content.contact,
                      email: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="support@veloscope.in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={selectedSlide.content.contact?.phone || ''}
                    onChange={(e) => updateSlideContent('contact', {
                      ...selectedSlide.content.contact,
                      phone: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91-8304033534"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Websites (comma separated)</label>
                  <input
                    type="text"
                    value={selectedSlide.content.contact?.websites?.join(', ') || ''}
                    onChange={(e) => updateSlideContent('contact', {
                      ...selectedSlide.content.contact,
                      websites: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://veloscope.in, https://eventforce.ai"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-xl p-8">
              <Type className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Slide Type</h3>
              <p className="text-gray-600 mb-6">Choose a slide type to start editing content</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {slideTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      const newContent = {
                        type: type.value as any,
                        features: type.value === 'welcome' || type.value === 'platform' || type.value === 'creative' || type.value === 'benefits' 
                          ? [{ icon: "✨", title: "New Feature", desc: "Feature description" }]
                          : undefined,
                        pricing: type.value === 'pricing' 
                          ? { title: "Platform Pricing", subscription: "₹3,00,000/year", regularPrice: "₹4,50,000/year", savings: "₹1,50,000/year" }
                          : undefined,
                        creativePricing: type.value === 'pricing'
                          ? { title: "Creative Services", annual: "₹1,00,000+GST/month", individual: "₹25,000+GST/month", shortTerm: "₹30,000+GST/month" }
                          : undefined,
                        nextSteps: type.value === 'cta'
                          ? [{ icon: "🤝", title: "Partnership Discussion", desc: "Detailed discussion about requirements" }]
                          : undefined,
                        contact: type.value === 'cta'
                          ? { email: "support@veloscope.in", phone: "+91-8304033534", websites: ["https://veloscope.in"] }
                          : undefined
                      };
                      updateSlideContent('type', type.value);
                      Object.entries(newContent).forEach(([key, value]) => {
                        if (value !== undefined) {
                          updateSlideContent(key, value);
                        }
                      });
                    }}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-center"
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{type.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2">
      <div className="relative w-full h-full max-w-[98vw] max-h-[98vh]">
        {/* Flip Card Container */}
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Side - Editor */}
          <motion.div
            className={`absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden ${
              isFlipped ? 'backface-hidden' : ''
            }`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Editor Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <Edit className="h-8 w-8 text-blue-600" />
                  <span>Slide Editor</span>
                </h2>
                <p className="text-lg text-gray-600 mt-2">Edit your presentation content with real-time preview</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsFlipped(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl text-lg"
                >
                  <Eye className="h-5 w-5" />
                  <span>Preview Mode</span>
                </button>
                <button
                  onClick={onCancel}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onSave(editedSlides)}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 shadow-lg hover:shadow-xl text-lg"
                >
                  <Save className="h-5 w-5" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex h-[calc(98vh-140px)]">
              {/* Slides List */}
              <div className="w-96 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Slides ({editedSlides.length})</h3>
                    <div className="flex space-x-3">
                      <button
                        onClick={addSlide}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-all duration-200 flex items-center space-x-2 text-sm"
                      >
                        <Plus className="h-5 w-5" />
                        <span>Add</span>
                      </button>
                      <button
                        onClick={() => {
                          // Duplicate current slide
                          const newSlide = {
                            ...selectedSlide,
                            id: Date.now(),
                            title: `${selectedSlide.title} (Copy)`
                          };
                          const newSlides = [...editedSlides];
                          newSlides.splice(selectedSlideIndex + 1, 0, newSlide);
                          setEditedSlides(newSlides);
                          setSelectedSlideIndex(selectedSlideIndex + 1);
                        }}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-200 transition-all duration-200 flex items-center space-x-2 text-sm"
                      >
                        <Plus className="h-5 w-5" />
                        <span>Duplicate</span>
                      </button>
                    </div>
                  </div>

                  <Reorder.Group 
                    axis="y" 
                    values={editedSlides} 
                    onReorder={setEditedSlides}
                    className="space-y-2"
                  >
                    {editedSlides.map((slide, index) => (
                      <Reorder.Item
                        key={slide.id}
                        value={slide}
                        className="cursor-pointer"
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 rounded-xl transition-all ${
                            selectedSlideIndex === index
                              ? 'bg-blue-100 border-2 border-blue-400 shadow-lg'
                              : 'bg-white hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedSlideIndex(index)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg font-bold text-gray-600">
                                  #{index + 1}
                                </span>
                                <span className="text-2xl">
                                  {slideTypes.find(t => t.value === slide.content.type)?.icon || '📄'}
                                </span>
                                <span className="text-base font-semibold text-gray-900 truncate">
                                  {slide.title}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 truncate mt-2">
                                {slide.subtitle}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Move slide up
                                  if (index > 0) {
                                    const newSlides = [...editedSlides];
                                    [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
                                    setEditedSlides(newSlides);
                                    setSelectedSlideIndex(index - 1);
                                  }
                                }}
                                disabled={index === 0}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                                title="Move up"
                              >
                                ↑
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Move slide down
                                  if (index < editedSlides.length - 1) {
                                    const newSlides = [...editedSlides];
                                    [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
                                    setEditedSlides(newSlides);
                                    setSelectedSlideIndex(index + 1);
                                  }
                                }}
                                disabled={index === editedSlides.length - 1}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                                title="Move down"
                              >
                                ↓
                              </button>
                              {editedSlides.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSlide(index);
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                  title="Delete slide"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              </div>

              {/* Editor Panel */}
              <div className="flex-1 p-8 overflow-y-auto">
                {selectedSlide && (
                  <div className="space-y-8">
                    {/* Slide Basic Info */}
                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Slide Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-base font-semibold text-gray-700 mb-3">Title</label>
                          <input
                            type="text"
                            value={selectedSlide.title}
                            onChange={(e) => updateSlide('title', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                            placeholder="Slide title"
                          />
                        </div>
                        <div>
                          <label className="block text-base font-semibold text-gray-700 mb-3">Subtitle</label>
                          <input
                            type="text"
                            value={selectedSlide.subtitle}
                            onChange={(e) => updateSlide('subtitle', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                            placeholder="Slide subtitle"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Slide Type Selector */}
                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Slide Type</h3>
                      <p className="text-lg text-gray-600 mb-6">Choose the type of content for this slide</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {slideTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => {
                              const newContent = {
                                type: type.value as any,
                                features: type.value === 'welcome' || type.value === 'platform' || type.value === 'creative' || type.value === 'benefits' 
                                  ? [{ icon: "✨", title: "New Feature", desc: "Feature description" }]
                                  : undefined,
                                pricing: type.value === 'pricing' 
                                  ? { title: "Platform Pricing", subscription: "₹3,00,000/year", regularPrice: "₹4,50,000/year", savings: "₹1,50,000/year" }
                                  : undefined,
                                creativePricing: type.value === 'pricing'
                                  ? { title: "Creative Services", annual: "₹1,00,000+GST/month", individual: "₹25,000+GST/month", shortTerm: "₹30,000+GST/month" }
                                  : undefined,
                                nextSteps: type.value === 'cta'
                                  ? [{ icon: "🤝", title: "Partnership Discussion", desc: "Detailed discussion about requirements" }]
                                  : undefined,
                                contact: type.value === 'cta'
                                  ? { email: "support@veloscope.in", phone: "+91-8304033534", websites: ["https://veloscope.in"] }
                                  : undefined
                              };
                              updateSlideContent('type', type.value);
                              Object.entries(newContent).forEach(([key, value]) => {
                                if (value !== undefined) {
                                  updateSlideContent(key, value);
                                }
                              });
                            }}
                            className={`p-6 rounded-xl border-2 transition-all text-center ${
                              selectedSlide.content.type === type.value
                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            <div className="text-3xl mb-3">{type.icon}</div>
                            <div className="text-base font-semibold">{type.label}</div>
                            <div className="text-sm text-gray-500 mt-2">{type.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Content Editor */}
                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Content</h3>
                      {renderSlideContentEditor()}
                    </div>
                  </div>
                )}
              </div>

              {/* Style Panel */}
              <div className="w-96 bg-gray-50 border-l border-gray-200 overflow-hidden">
                <EnhancedStylePanel
                  styles={slideStyles}
                  onStyleChange={setSlideStyles}
                  onReset={() => setSlideStyles({
                    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textColor: '#ffffff',
                    accentColor: '#f59e0b',
                    borderRadius: '12px',
                    shadow: '0 10px 25px rgba(0,0,0,0.1)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    animation: 'none',
                    opacity: 1
                  })}
                />
              </div>
            </div>
          </motion.div>

          {/* Back Side - Presentation Preview */}
          <motion.div
            className={`absolute inset-0 bg-black rounded-2xl shadow-2xl overflow-hidden ${
              !isFlipped ? 'backface-hidden' : ''
            }`}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {/* Presentation Header */}
            <div className="absolute top-4 left-4 z-30 flex items-center space-x-3">
              <button
                onClick={() => setIsFlipped(false)}
                className="p-3 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-200"
                title="Back to Editor"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
                Presentation Preview
              </div>
            </div>

            {/* Full Screen Presentation */}
            <EnhancedSlidePreview
              slide={selectedSlide}
              styles={slideStyles}
              isPresentationMode={true}
              onBackToEdit={() => setIsFlipped(false)}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 