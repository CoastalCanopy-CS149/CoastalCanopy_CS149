import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAnSZI7AnQ1exK5gPCMyhgrkDofw_n7H4w",
  authDomain: "coastalcanopy-auth-731ef.firebaseapp.com",
  projectId: "coastalcanopy-auth-731ef",
  storageBucket: "coastalcanopy-auth-731ef.appspot.com",
  messagingSenderId: "720040173391",
  appId: "1:720040173391:web:86a90280ca2eb695e62f3a",
  measurementId: "G-RSSP4PCP6H",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// Google Sign-In Function
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    console.log("User Signed In:", user);

    // Check if username exists in localStorage
    const userKey = `username_${user.uid}`;
    const hasUsername = localStorage.getItem(userKey);

    console.log(`Checking localStorage for key: ${userKey}, found:`, hasUsername);

    if (!hasUsername || hasUsername === "undefined" || hasUsername === "null") {
      console.log("No username found. Redirecting to username setup.");
      return { ...user, needsUsername: true };
    }

    console.log("Username found. Redirecting to home.");
    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    return null;
  }
}

export { app, auth, googleProvider, signInWithGoogle }

