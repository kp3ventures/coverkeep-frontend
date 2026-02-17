// Environment configuration
// CRITICAL: Expo requires EXPO_PUBLIC_ prefix for environment variables!
export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/coverkeep-af231/us-central1/api/api/v1',
  IS_DEV: __DEV__,
  APP_NAME: 'CoverKeep',
  APP_VERSION: '1.0.0',
};

// Firebase config
export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyD_THnIHdqWQ14EIhbmIysDGiBdLTWjq84',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'coverkeep-af231.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'coverkeep-af231',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'coverkeep-af231.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '594344844244',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:594344844244:web:a69dbfe8b075034d3d1441',
};
