import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface FormSubmission {
  feedback: string;
  rating: number;
  suggestions?: string;
  selected_options?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_notes?: string;
}

export interface PageVisit {
  page_name: string;
}

export interface PageVisitUpdate {
  exit_time: string;
  duration_seconds: number;
}

// Auth API
export const authAPI = {
  login: (data: LoginRequest) => api.post<TokenResponse>('/auth/login', data),
  signup: (data: LoginRequest & { username: string; role?: string }) => 
    api.post<User>('/auth/signup', data),
  getMe: () => api.get<User>('/auth/me'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get<User[]>('/users/'),
  create: (data: LoginRequest & { username: string; role?: string }) => 
    api.post<User>('/users/', data),
};

// Forms API
export const formsAPI = {
  submit: (data: FormSubmission) => api.post('/forms/submit', data),
  getSubmissions: () => api.get('/forms/submissions'),
  getMySubmission: () => api.get('/forms/my-submission'),
};

// Analytics API
export const analyticsAPI = {
  createPageVisit: (data: PageVisit) => api.post('/analytics/page-visit', data),
  updatePageVisit: (visitId: number, data: PageVisitUpdate) => 
    api.put(`/analytics/page-visit/${visitId}`, data),
  getUserAnalytics: () => api.get('/analytics/user-analytics'),
  getMyAnalytics: () => api.get('/analytics/my-analytics'),
};

export default api; 