import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  followersCount: number;
  followingCount: number;
  snippetsCount: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOAD_USER_START' }
  | { type: 'LOAD_USER_SUCCESS'; payload: { user: User } }
  | { type: 'LOAD_USER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: { user: User } }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
    case 'LOAD_USER_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
    case 'LOAD_USER_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (userData: { username: string; email: string; password: string; bio?: string }) => Promise<any>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<any>;
  clearError: () => void;
} | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          dispatch({ type: 'LOAD_USER_START' });
          const response = await authAPI.getMe();
          dispatch({
            type: 'LOAD_USER_SUCCESS',
            payload: { user: response.data.user },
          });
        } catch (error: any) {
          dispatch({
            type: 'LOAD_USER_FAILURE',
            payload: error.response?.data?.message || 'Failed to load user',
          });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        dispatch({ type: 'LOAD_USER_SUCCESS', payload: { user: null as any } });
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authAPI.login(credentials);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  const register = async (userData: { username: string; email: string; password: string; bio?: string }) => {
    try {
      dispatch({ type: 'REGISTER_START' });
      const response = await authAPI.register(userData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (profileData: any) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      dispatch({
        type: 'UPDATE_PROFILE_SUCCESS',
        payload: { user: response.data.user },
      });
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateProfile, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
