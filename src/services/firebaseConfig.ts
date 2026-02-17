import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_THnIHdqWQ14EIhbmIysDGiBdLTWjq84",
  authDomain: "coverkeep-af231.firebaseapp.com",
  projectId: "coverkeep-af231",
  storageBucket: "coverkeep-af231.firebasestorage.app",
  messagingSenderId: "PLACEHOLDER", // Update when available
  appId: "PLACEHOLDER" // Update when available
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
