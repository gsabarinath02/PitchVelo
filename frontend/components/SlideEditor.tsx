'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  Minimize2
} from 'lucide-react';

import { SlideContent } from '@/lib/api';
import EnhancedSlidePreview from './EnhancedSlidePreview';
import EnhancedStylePanel from './EnhancedStylePanel';
import FlipCardSlideEditor from './FlipCardSlideEditor';

interface SlideEditorProps {
  slides: SlideContent[];
  onSave: (slides: SlideContent[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function SlideEditor({ slides, onSave, onCancel, isLoading = false }: SlideEditorProps) {
  // Use the new FlipCardSlideEditor for the enhanced experience
  return (
    <FlipCardSlideEditor
      slides={slides}
      onSave={onSave}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
} 