'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, User, Shield, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersAPI } from '@/lib/api';

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  created_at: string;
}

interface AdminUserTableProps {
  users: User[];
  onUserChange?: () => void;
}

export default function AdminUserTable({ users, onUserChange }: AdminUserTableProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get current user from localStorage to check if it's the current admin
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const handleCreateUser = async (formData: any) => {
    setIsCreating(true);
    try {
      await usersAPI.create(formData);
      toast.success('User created successfully!');
      setShowCreateForm(false);
      // Call the refresh function instead of reloading the page
      if (onUserChange) {
        onUserChange();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    setIsDeleting(true);
    try {
      await usersAPI.delete(user.id);
      toast.success(`User ${user.username} deleted successfully!`);
      setUserToDelete(null);
      // Call the refresh function instead of reloading the page
      if (onUserChange) {
        onUserChange();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to delete user';
      toast.error(errorMessage);
      
      // If it's a "cannot delete yourself" error, close the dialog
      if (errorMessage.includes('Cannot delete your own account')) {
        setUserToDelete(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
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
            {users.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.role === 'admin' ? (
                      <Shield className="h-4 w-4 text-red-500 mr-2" />
                    ) : (
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                    )}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      className="text-primary-600 hover:text-primary-900 transition-colors"
                      title="Edit user"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setUserToDelete(user)}
                      className={`transition-colors ${
                        user.id === currentUser.id 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-red-600 hover:text-red-900'
                      }`}
                      title={
                        user.id === currentUser.id 
                          ? "Cannot delete your own account" 
                          : "Delete user"
                      }
                      disabled={user.id === currentUser.id}
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

      {/* Create User Form */}
      {showCreateForm && (
        <CreateUserForm
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateForm(false)}
          isLoading={isCreating}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {userToDelete && (
          <DeleteConfirmationDialog
            user={userToDelete}
            onConfirm={() => handleDeleteUser(userToDelete)}
            onCancel={() => setUserToDelete(null)}
            isLoading={isDeleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface DeleteConfirmationDialogProps {
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

function DeleteConfirmationDialog({ user, onConfirm, onCancel, isLoading }: DeleteConfirmationDialogProps) {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isCurrentUser = user.id === currentUser.id;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete the user <strong>{user.username}</strong>?
            </p>
            
            {isCurrentUser && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800 mb-1">Warning: Current User</p>
                    <p className="text-sm text-orange-700">
                      You are trying to delete your own account. This action is not allowed for security reasons.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">This action cannot be undone</p>
                  <p className="text-sm text-red-700">
                    This will permanently delete the user account and all associated data including:
                  </p>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    <li>• User profile and settings</li>
                    <li>• Form submissions and feedback</li>
                    <li>• Analytics and tracking data</li>
                    <li>• Login/logout history</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                <User className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Role: <span className="capitalize">{user.role}</span> • 
                  Created: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading || isCurrentUser}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex-1 flex items-center justify-center ${
                isCurrentUser 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isCurrentUser ? 'Cannot Delete Self' : 'Delete User'}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface CreateUserFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function CreateUserForm({ onSubmit, onCancel, isLoading }: CreateUserFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'user',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-md w-full mx-4"
      >
        <h3 className="text-lg font-semibold mb-4">Create New User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="input-field"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="input-field"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 