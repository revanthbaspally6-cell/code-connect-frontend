import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData: any) => api.put('/auth/profile', profileData),
};

export const snippetsAPI = {
  getSnippets: (params: any) => api.get('/snippets', { params }),
  getSnippet: (id: string) => api.get(`/snippets/${id}`),
  createSnippet: (snippetData: any) => api.post('/snippets', snippetData),
  updateSnippet: (id: string, snippetData: any) => api.put(`/snippets/${id}`, snippetData),
  deleteSnippet: (id: string) => api.delete(`/snippets/${id}`),
  likeSnippet: (id: string) => api.post(`/snippets/${id}/like`),
  unlikeSnippet: (id: string) => api.delete(`/snippets/${id}/like`),
  bookmarkSnippet: (id: string) => api.post(`/snippets/${id}/bookmark`),
  unbookmarkSnippet: (id: string) => api.delete(`/snippets/${id}/bookmark`),
  getSnippetComments: (id: string) => api.get(`/snippets/${id}/comments`),
  addComment: (id: string, commentData: any) => api.post(`/snippets/${id}/comments`, commentData),
  getUserSnippets: (userId: string, params: any) => api.get(`/snippets/user/${userId}`, { params }),
};

export default api;
