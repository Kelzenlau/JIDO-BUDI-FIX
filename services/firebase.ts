

// Fix: Simplified imports to resolve 'no exported member' errors for initializeApp and FirebaseApp.
// Removing explicit type imports and annotations allows the compiler to use inferred types from the SDK.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// Fix: Initializing services using inferred types to avoid dependency on problematic type-only exports
export const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = typeof __app_id !== 'undefined' && __app_id ? __app_id : 'default-app-id';
