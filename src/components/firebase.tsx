// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, OAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDp8K3w2zAatmcZfp1za0M0fP1-_5mVgIg",
  authDomain: "transponders-snail.firebaseapp.com",
  databaseURL: "https://transponders-snail-default-rtdb.firebaseio.com",
  projectId: "transponders-snail",
  storageBucket: "transponders-snail.firebasestorage.app",
  messagingSenderId: "726588618357",
  appId: "1:726588618357:web:b4d31f5b5bb5b98f7c2a3c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const microsoftProvider = new OAuthProvider("microsoft.com");
microsoftProvider.setCustomParameters({
  prompt: "consent", // always ask consent
});
export const auth = getAuth(app);