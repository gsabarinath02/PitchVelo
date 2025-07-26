'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  CheckCircle, 
  XCircle,
  FileText,
  Settings,
  UserCheck
} from 'lucide-react';
import { personalizedPresentationsAPI, usersAPI, PersonalizedPresentationWithUser, User } from '@/lib/api';
import SlideEditor from './SlideEditor';

interface PersonalizedPresentationsManagerProps {
  onClose: () => void;
}

interface CreatePresentationFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
  users: User[];
}

function CreatePresentationForm({ onSubmit, onCancel, isLoading, users }: CreatePresentationFormProps) {
  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    subtitle: '',
    is_active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      user_id: parseInt(formData.user_id),
      slides: [] // Default empty slides array
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Create Personalized Presentation</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User
              </label>
              <select
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presentation Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter presentation title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presentation Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter presentation subtitle"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Active presentation
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Presentation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default function PersonalizedPresentationsManager({ onClose }: PersonalizedPresentationsManagerProps) {
  const [presentations, setPresentations] = useState<PersonalizedPresentationWithUser[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSlideEditor, setShowSlideEditor] = useState(false);
  const [editingPresentation, setEditingPresentation] = useState<PersonalizedPresentationWithUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [presentationsRes, usersRes] = await Promise.all([
        personalizedPresentationsAPI.getAll(),
        usersAPI.getAll()
      ]);
      setPresentations(presentationsRes.data);
      setUsers(usersRes.data);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePresentation = async (data: any) => {
    try {
      setIsCreating(true);
      await personalizedPresentationsAPI.create(data);
      await loadData();
      setShowCreateForm(false);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to create presentation');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePresentation = async (presentationId: number) => {
    if (!confirm('Are you sure you want to delete this presentation?')) return;
    
    try {
      await personalizedPresentationsAPI.delete(presentationId);
      await loadData();
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to delete presentation');
    }
  };

  const handleToggleActive = async (presentation: PersonalizedPresentationWithUser) => {
    try {
      await personalizedPresentationsAPI.update(presentation.id, {
        is_active: !presentation.is_active
      });
      await loadData();
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to update presentation');
    }
  };

  const handleEditPresentation = (presentation: PersonalizedPresentationWithUser) => {
    setEditingPresentation(presentation);
    setShowSlideEditor(true);
  };

  const handleSaveSlides = async (slides: any[]) => {
    if (!editingPresentation) return;
    
    try {
      await personalizedPresentationsAPI.update(editingPresentation.id, {
        slides: slides
      });
      await loadData();
      setShowSlideEditor(false);
      setEditingPresentation(null);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to update presentation');
    }
  };

  // Convert slides to editor format
  const convertSlidesForEditor = (slides: any[]): any[] => {
    if (!slides || slides.length === 0) {
      return []; // Return empty array to trigger default slides
    }
    return slides.map(slide => ({
      ...slide,
      content: {
        type: slide.content?.type || 'welcome',
        features: slide.content?.features || [],
        pricing: slide.content?.pricing || {},
        creativePricing: slide.content?.creativePricing || {},
        nextSteps: slide.content?.nextSteps || [],
        contact: slide.content?.contact || {}
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Personalized Presentations
          </h2>
          <p className="text-gray-600">
            Manage customized presentations for individual users
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Presentation</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {/* Presentations List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {presentations.map((presentation) => (
                <motion.tr
                  key={presentation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {presentation.user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {presentation.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {presentation.title || 'Untitled Presentation'}
                    </div>
                    {presentation.subtitle && (
                      <div className="text-sm text-gray-500">
                        {presentation.subtitle}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      presentation.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {presentation.is_active ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(presentation.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleActive(presentation)}
                        className={`transition-colors ${
                          presentation.is_active
                            ? 'text-orange-600 hover:text-orange-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={presentation.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {presentation.is_active ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditPresentation(presentation)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit presentation"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePresentation(presentation.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete presentation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {presentations.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No presentations</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a personalized presentation for a user.
            </p>
          </div>
        )}
      </div>

      {/* Create Form Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <CreatePresentationForm
            onSubmit={handleCreatePresentation}
            onCancel={() => setShowCreateForm(false)}
            isLoading={isCreating}
            users={users}
          />
        )}
      </AnimatePresence>

      {/* Slide Editor Modal */}
      <AnimatePresence>
        {showSlideEditor && editingPresentation && (
          <SlideEditor
            slides={convertSlidesForEditor(editingPresentation.slides)}
            onSave={handleSaveSlides}
            onCancel={() => {
              setShowSlideEditor(false);
              setEditingPresentation(null);
            }}
            isLoading={isCreating}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 