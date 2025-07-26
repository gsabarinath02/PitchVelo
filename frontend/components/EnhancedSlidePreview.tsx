'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Smartphone,
  Monitor,
  Tablet,
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

interface SlidePreviewProps {
  slide: any;
  styles: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    borderRadius: string;
    shadow: string;
    fontFamily: string;
    fontSize: string;
  };
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onBackToEdit?: () => void;
  isPresentationMode?: boolean;
}

const deviceSizes = [
  { name: 'Desktop', width: '100%', height: '100vh', icon: Monitor },
  { name: 'Tablet', width: '768px', height: '100vh', icon: Tablet },
  { name: 'Mobile', width: '375px', height: '100vh', icon: Smartphone }
];

export default function EnhancedSlidePreview({ 
  slide, 
  styles, 
  isFullscreen = false, 
  onToggleFullscreen,
  onBackToEdit,
  isPresentationMode = false
}: SlidePreviewProps) {
  const [currentDevice, setCurrentDevice] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const DeviceIcon = deviceSizes[currentDevice].icon;

  const renderSlideContent = () => {
    if (!slide) return null;

    const baseClasses = "transition-all duration-300 ease-in-out";
    
    switch (slide.content?.type) {
      case 'welcome':
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent leading-tight">
                {slide.title}
              </h1>
              <p className="text-2xl md:text-3xl opacity-90 font-light max-w-4xl mx-auto">
                {slide.subtitle}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
              {slide.content.features?.map((feature: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover-lift"
                >
                  <div className="text-6xl md:text-8xl mb-6 animate-bounce-gentle">{feature.icon}</div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-lg md:text-xl opacity-90 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'platform':
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent leading-tight">
                {slide.title}
              </h1>
              <p className="text-2xl md:text-3xl opacity-90 font-light max-w-4xl mx-auto">
                {slide.subtitle}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
              {slide.content.features?.map((feature: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover-lift"
                >
                  <div className="flex items-start space-x-6">
                    <div className="text-5xl md:text-6xl flex-shrink-0">{feature.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-lg md:text-xl opacity-90 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent leading-tight">
                {slide.title}
              </h1>
              <p className="text-2xl md:text-3xl opacity-90 font-light max-w-4xl mx-auto">
                {slide.subtitle}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl w-full">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover-lift"
              >
                <h3 className="text-3xl font-bold mb-6 text-center">{slide.content.pricing?.title}</h3>
                <div className="text-center">
                  <div className="text-6xl font-bold mb-4" style={{ color: styles.accentColor }}>
                    {slide.content.pricing?.subscription}
                  </div>
                  <div className="text-xl opacity-75 mb-4">
                    Regular: <span className="line-through">{slide.content.pricing?.regularPrice}</span>
                  </div>
                  <div className="text-2xl font-semibold" style={{ color: styles.accentColor }}>
                    Save: {slide.content.pricing?.savings}
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover-lift"
              >
                <h3 className="text-3xl font-bold mb-6 text-center">{slide.content.creativePricing?.title}</h3>
                <div className="space-y-4 text-xl">
                  <div className="flex justify-between items-center">
                    <span>Annual (6 Events)</span>
                    <span className="font-bold" style={{ color: styles.accentColor }}>
                      {slide.content.creativePricing?.annual}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Individual Event</span>
                    <span>{slide.content.creativePricing?.individual}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Short-term (3 months)</span>
                    <span>{slide.content.creativePricing?.shortTerm}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'benefits':
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent leading-tight">
                {slide.title}
              </h1>
              <p className="text-2xl md:text-3xl opacity-90 font-light max-w-4xl mx-auto">
                {slide.subtitle}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
              {slide.content.features?.map((feature: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover-lift"
                >
                  <div className="text-5xl md:text-6xl mb-6">{feature.icon}</div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-lg md:text-xl opacity-90 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent leading-tight">
                {slide.title}
              </h1>
              <p className="text-2xl md:text-3xl opacity-90 font-light max-w-4xl mx-auto">
                {slide.subtitle}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-6xl w-full">
              {slide.content.nextSteps?.map((step: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover-lift"
                >
                  <div className="text-5xl md:text-6xl mb-6">{step.icon}</div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg md:text-xl opacity-90">{step.desc}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center p-12 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 max-w-4xl w-full hover-lift"
            >
              <h3 className="text-4xl font-bold mb-6">Get Started Today</h3>
              <div className="space-y-3 text-xl">
                <p>Email: {slide.content.contact?.email}</p>
                <p>Phone: {slide.content.contact?.phone}</p>
                <div className="flex justify-center space-x-6 mt-6">
                  {slide.content.contact?.websites?.map((site: string, index: number) => (
                    <a 
                      key={index}
                      href={site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg underline hover:no-underline hover-glow"
                      style={{ color: styles.accentColor }}
                    >
                      {site}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-8">
            <div className="text-center">
              <h1 className="text-6xl md:text-8xl font-bold mb-6">{slide?.title}</h1>
              <p className="text-2xl md:text-3xl opacity-90">{slide?.subtitle}</p>
            </div>
          </div>
        );
    }
  };

  if (isPresentationMode) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black"
        style={{
          background: styles.backgroundColor,
          color: styles.textColor,
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize
        }}
      >
        {/* Presentation Controls */}
        <AnimatePresence>
          {showControls && (isHovered || isFullscreen) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-4 z-20 flex items-center space-x-2"
            >
              <button
                onClick={onBackToEdit}
                className="p-3 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-200"
                title="Back to Editor"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-200"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-200"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              
              <button
                onClick={() => setCurrentDevice((prev) => (prev + 1) % deviceSizes.length)}
                className="p-3 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-200"
                title={`Switch to ${deviceSizes[(currentDevice + 1) % deviceSizes.length].name}`}
              >
                <DeviceIcon className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Device Label */}
        <div className="absolute top-4 right-4 z-20">
          <div className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
            {deviceSizes[currentDevice].name} Preview
          </div>
        </div>

        {/* Full Screen Content */}
        <div 
          className="w-full h-full overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {renderSlideContent()}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-gray-900 rounded-2xl overflow-hidden"
      style={{ 
        width: deviceSizes[currentDevice].width,
        height: deviceSizes[currentDevice].height,
        maxWidth: '100%',
        maxHeight: '100%'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Device Frame */}
      <div className="absolute inset-0 border-4 border-gray-800 rounded-2xl pointer-events-none z-10" />
      
      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (isHovered || isFullscreen) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 right-4 z-20 flex items-center space-x-2"
          >
            <button
              onClick={() => setCurrentDevice((prev) => (prev + 1) % deviceSizes.length)}
              className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-200"
              title={`Switch to ${deviceSizes[(currentDevice + 1) % deviceSizes.length].name}`}
            >
              <DeviceIcon className="h-4 w-4" />
            </button>
            
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-200"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Device Label */}
      <div className="absolute top-4 left-4 z-20">
        <div className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
          {deviceSizes[currentDevice].name}
        </div>
      </div>

      {/* Slide Content */}
      <div 
        className="w-full h-full overflow-hidden"
        style={{
          background: styles.backgroundColor,
          color: styles.textColor,
          borderRadius: styles.borderRadius,
          boxShadow: styles.shadow,
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize
        }}
      >
        {renderSlideContent()}
      </div>

      {/* Loading State */}
      {!slide && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
          <div className="text-white text-lg">Loading preview...</div>
        </div>
      )}
    </div>
  );
} 