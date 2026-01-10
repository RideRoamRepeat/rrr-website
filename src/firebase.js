import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAmFbGjXXYaUIUNZHMKaFsln08NiZ9cCJw",
  authDomain: "ride-roam-repeat.firebaseapp.com",
  projectId: "ride-roam-repeat",
  storageBucket: "ride-roam-repeat.firebasestorage.app",
  messagingSenderId: "852805878468",
  appId: "1:852805878468:web:868ce923d55648cf0c7f91",
  measurementId: "G-8BNGH94KQS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Safe analytics initialization - completely isolated from main app flow
let analyticsInstance = null;
let analyticsInitialized = false;

const initializeAnalytics = () => {
  if (analyticsInitialized) return analyticsInstance;
  
  try {
    // Only initialize in production environment
    if (typeof window !== 'undefined' && 
        window.location && 
        window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1') {
      
      analyticsInstance = getAnalytics(app);
      console.log('Firebase Analytics initialized');
    } else {
      console.log('Firebase Analytics disabled in development');
    }
  } catch (error) {
    console.warn('Firebase Analytics initialization failed:', error);
    analyticsInstance = null;
  }
  
  analyticsInitialized = true;
  return analyticsInstance;
};

// Export a safe analytics object that won't crash the app
export const analytics = {
  logEvent: (eventName, parameters) => {
    const instance = initializeAnalytics();
    if (instance && eventName) {
      try {
        instance.logEvent(eventName, parameters);
      } catch (error) {
        console.warn('Analytics logEvent failed:', error);
      }
    }
  }
};
