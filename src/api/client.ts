import axios from 'axios';
import { ENV } from '../config/env';

// Use environment variable with proper Expo prefix
const API_BASE_URL = ENV.API_URL;

console.log('[API Client] Initialized with base URL:', API_BASE_URL);
console.log('[API Client] Environment:', ENV.IS_DEV ? 'Development' : 'Production');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  async (config) => {
    // TODO: Get token from Firebase auth
    // const token = await getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: Handle unauthorized (logout)
    }
    return Promise.reject(error);
  }
);
