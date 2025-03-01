import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
        apiKey: "AIzaSyBcSSO907vJ6w1LL0xdOa6yUDWhzRPA9nE",
        authDomain: "coastalcanopy-auth-9156a.firebaseapp.com",
        projectId: "coastalcanopy-auth-9156a",
        storageBucket: "coastalcanopy-auth-9156a.firebasestorage.app",
        messagingSenderId: "900247736533",
        appId: "1:900247736533:web:45778ecb97922f61f8d25c",
        measurementId: "G-JCLXKFLY7X"     
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Setup providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider, signInWithPopup };
