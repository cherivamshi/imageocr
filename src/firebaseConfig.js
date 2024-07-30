// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// Import other Firebase services you plan to use
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgTJYpgL4CYhBozuKdPh6P8Y40PR_D1XU",
  authDomain: "imageocr-84327.firebaseapp.com",
  projectId: "imageocr-84327",
  storageBucket: "imageocr-84327.appspot.com",
  messagingSenderId: "649424018234",
  appId: "1:649424018234:web:cbc6e68f55fbb45f510e03",
  measurementId: "G-FMSBWSBPX2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize other Firebase services if needed
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, firestore, storage };
