import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAnSZI7AnQ1exK5gPCMyhgrkDofw_n7H4w",
  authDomain: "coastalcanopy-auth-731ef.firebaseapp.com",
  projectId: "coastalcanopy-auth-731ef",
  storageBucket: "coastalcanopy-auth-731ef.appspot.com",
  messagingSenderId: "720040173391",
  appId: "1:720040173391:web:86a90280ca2eb695e62f3a",
  measurementId: "G-RSSP4PCP6H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign-In Function
const signInWithGoogle = async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          console.log("User Info:", result.user);
          return result.user; // Successfully signed in
        } catch (error) {
          if (error.code === "auth/popup-closed-by-user") {
            console.log("User closed the popup before signing in.");
            return null; // Gracefully handle user canceling sign-in
          }
      
          console.error("Google Sign-In Error:", error.message);
          return null; // Return null instead of throwing error
        }
      };
      

export { app, auth, googleProvider, signInWithGoogle };

