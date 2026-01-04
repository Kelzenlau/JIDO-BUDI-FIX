
// Fix: Separated value and type imports for the Firebase modular SDK to resolve potential module resolution issues that can occur in certain TypeScript environments.
import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

// Fallback config for development/safety if environment variables are missing
const defaultFirebaseConfig = {
  apiKey: "dummy-api-key",
  authDomain: "dummy.firebaseapp.com",
  projectId: "dummy-project",
  storageBucket: "dummy.appspot.com",
  messagingSenderId: "000000000",
  appId: "1:00000000:web:00000000"
};

let config = defaultFirebaseConfig;
if (typeof __firebase_config !== 'undefined' && __firebase_config) {
  try {
    config = JSON.parse(__firebase_config);
  } catch (e) {
    console.warn("Failed to parse injected firebase config", e);
  }
}

// Fix: Initialize Firebase services using standard modular functions and types for robust compatibility
export const app: FirebaseApp = initializeApp(config);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const appId = typeof __app_id !== 'undefined' && __app_id ? __app_id : 'default-app-id';
