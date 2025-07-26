'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Palette, 
  Type, 
  Droplets, 
  Sun, 
  Moon,
  Sparkles,
  Layers,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';

interface StylePanelProps {
  styles: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    borderRadius: string;
    shadow: string;
    fontFamily: string;
    fontSize: string;
    animation: string;
    opacity: number;
  };
  onStyleChange: (styles: any) => void;
  onReset: () => void;
}

const backgroundOptions = [
  { 
    name: 'Gradient Blue', 
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  { 
    name: 'Gradient Purple', 
    value: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    preview: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
  },
  { 
    name: 'Gradient Orange', 
    value: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    preview: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
  },
  { 
    name: 'Gradient Green', 
    value: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    preview: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  { 
    name: 'Solid Blue', 
    value: '#3b82f6',
    preview: '#3b82f6'
  },
  { 
    name: 'Solid Purple', 
    value: '#8b5cf6',
    preview: '#8b5cf6'
  },
  { 
    name: 'Solid Green', 
    value: '#10b981',
    preview: '#10b981'
  },
  { 
    name: 'Solid Red', 
    value: '#ef4444',
    preview: '#ef4444'
  },
  { 
    name: 'Dark Theme', 
    value: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    preview: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
  },
  { 
    name: 'Light Theme', 
    value: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    preview: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
  }
];

const colorOptions = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Pink', value: '#ec4899' }
];

const accentColorOptions = [
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Cyan', value: '#06b6d4' }
];

const fontFamilyOptions = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif' },
  { name: 'Nunito', value: 'Nunito, sans-serif' }
];

const fontSizeOptions = [
  { name: 'Small', value: '14px' },
  { name: 'Medium', value: '16px' },
  { name: 'Large', value: '18px' },
  { name: 'XL', value: '20px' },
  { name: '2XL', value: '24px' },
  { name: '3XL', value: '28px' }
];

const animationOptions = [
  { name: 'None', value: 'none' },
  { name: 'Fade In', value: 'fadeIn 0.5s ease-in' },
  { name: 'Slide Up', value: 'slideUp 0.5s ease-out' },
  { name: 'Scale In', value: 'scaleIn 0.3s ease-out' },
  { name: 'Bounce', value: 'bounce 0.6s ease-in-out' }
];

const borderRadiusOptions = [
  { name: 'None', value: '0px' },
  { name: 'Small', value: '4px' },
  { name: 'Medium', value: '8px' },
  { name: 'Large', value: '12px' },
  { name: 'XL', value: '16px' },
  { name: '2XL', value: '20px' },
  { name: '3XL', value: '24px' },
  { name: 'Full', value: '50px' }
];

export default function EnhancedStylePanel({ styles, onStyleChange, onReset }: StylePanelProps) {
  const [activeTab, setActiveTab] = useState('background');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateStyle = (key: string, value: any) => {
    onStyleChange({ ...styles, [key]: value });
  };

  const tabs = [
    { id: 'background', label: 'Background', icon: Droplets },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'effects', label: 'Effects', icon: Sparkles },
    { id: 'advanced', label: 'Advanced', icon: Layers }
  ];

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Styling</h3>
          <button
            onClick={onReset}
            className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset to defaults"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-4 px-3 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mb-2" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {activeTab === 'background' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Background Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {backgroundOptions.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => updateStyle('backgroundColor', option.value)}
                        className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                          styles.backgroundColor === option.value
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ background: option.preview }}
                      >
                        <div className="text-xs font-medium text-white drop-shadow-sm">
                          {option.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Background</label>
                  <input
                    type="text"
                    value={styles.backgroundColor}
                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Supports CSS gradients, colors, and images</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
                  <input
                    type="url"
                    value={styles.backgroundColor.includes('url(') ? styles.backgroundColor.match(/url\(([^)]+)\)/)?.[1] || '' : ''}
                    onChange={(e) => updateStyle('backgroundColor', `url(${e.target.value})`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Text Color</label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => updateStyle('textColor', color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                          styles.textColor === color.value
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Text Color</label>
                    <input
                      type="color"
                      value={styles.textColor}
                      onChange={(e) => updateStyle('textColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Accent Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {accentColorOptions.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => updateStyle('accentColor', color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                          styles.accentColor === color.value
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Accent Color</label>
                    <input
                      type="color"
                      value={styles.accentColor}
                      onChange={(e) => updateStyle('accentColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={styles.opacity}
                    onChange={(e) => updateStyle('opacity', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>{Math.round(styles.opacity * 100)}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                  <select
                    value={styles.fontFamily}
                    onChange={(e) => updateStyle('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fontFamilyOptions.map((font) => (
                      <option key={font.name} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <select
                    value={styles.fontSize}
                    onChange={(e) => updateStyle('fontSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fontSizeOptions.map((size) => (
                      <option key={size.name} value={size.value}>
                        {size.name} ({size.value})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'effects' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Border Radius</label>
                  <div className="grid grid-cols-4 gap-2">
                    {borderRadiusOptions.map((radius) => (
                      <button
                        key={radius.name}
                        onClick={() => updateStyle('borderRadius', radius.value)}
                        className={`p-2 rounded border-2 transition-all hover:scale-105 ${
                          styles.borderRadius === radius.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-xs">{radius.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Animation</label>
                  <select
                    value={styles.animation}
                    onChange={(e) => updateStyle('animation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {animationOptions.map((animation) => (
                      <option key={animation.name} value={animation.value}>
                        {animation.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opacity: {Math.round(styles.opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={styles.opacity}
                    onChange={(e) => updateStyle('opacity', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Shadow</label>
                  <input
                    type="text"
                    value={styles.shadow}
                    onChange={(e) => updateStyle('shadow', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="0 10px 25px rgba(0,0,0,0.1)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    rows={4}
                    placeholder="Add custom CSS styles..."
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 