import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/auth/login', data),
  
  signup: (data: { email: string; username: string; password: string }) =>
    api.post('/auth/auth/signup', data),
  
  getMe: () => api.get('/auth/auth/me'),
  
  logout: () => api.post('/analytics/analytics/logout'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users/users/'),
  getById: (id: number) => api.get(`/users/users/${id}`),
  create: (data: any) => api.post('/users/users/', data),
  update: (id: number, data: any) => api.put(`/users/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/users/${id}`),
};

// Forms API
export const formsAPI = {
  submit: (data: any) => api.post('/forms/forms/submit', data),
  getSubmissions: () => api.get('/forms/forms/submissions'),
  getSubmissionById: (id: number) => api.get(`/forms/forms/submissions/${id}`),
};

// Analytics API
export const analyticsAPI = {
  createPageVisit: (data: { page_name: string }) =>
    api.post('/analytics/analytics/page-visit', data),
  
  updatePageVisit: (visitId: number, data: { exit_time: string; duration_seconds: number }) =>
    api.put(`/analytics/analytics/page-visit/${visitId}`, data),
  
  getUserAnalytics: () => api.get('/analytics/analytics/user-analytics'),
  
  getSimplifiedAnalytics: () => api.get('/analytics/analytics/simplified-analytics'),
  
  getMyAnalytics: () => api.get('/analytics/analytics/my-analytics'),
};

// Personalized Presentations API
export const personalizedPresentationsAPI = {
  create: (data: any) => api.post('/forms/forms/personalized-presentations', data),
  getAll: () => api.get('/forms/forms/personalized-presentations'),
  getByUserId: (userId: number) => api.get(`/forms/forms/personalized-presentations/${userId}`),
  update: (presentationId: number, data: any) => 
    api.put(`/forms/forms/personalized-presentations/${presentationId}`, data),
  delete: (presentationId: number) => 
    api.delete(`/forms/forms/personalized-presentations/${presentationId}`),
};

// Types
export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  created_at: string;
}

export interface FormSubmission {
  id: number;
  user_id: number;
  feedback: string;
  rating: number;
  suggestions?: string;
  selected_options?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_notes?: string;
  submitted_at: string;
}

export interface UserSessionData {
  login_timestamp: string;
  logout_timestamp?: string;
  session_duration_seconds?: number;
  has_submitted_form: boolean;
}

export interface SimplifiedUserAnalytics {
  user: User;
  sessions: UserSessionData[];
  total_time_spent_seconds: number;
  total_logins: number;
  has_submitted_form: boolean;
}

export interface SlideContent {
  id: number;
  title: string;
  subtitle: string;
  content: Record<string, any>;
}

export interface PersonalizedPresentation {
  id: number;
  user_id: number;
  title?: string;
  subtitle?: string;
  slides: SlideContent[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonalizedPresentationWithUser extends PersonalizedPresentation {
  user: User;
} 