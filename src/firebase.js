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
export const analytics = getAnalytics(app);
