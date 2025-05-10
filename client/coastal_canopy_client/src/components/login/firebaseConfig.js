import axios from "axios"
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, ProviderId, signInWithPopup } from "firebase/auth"
import { siteConfig,firebaseConfig } from "../../constant/siteConfig"



// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// Google Sign-In Function
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log(user.providerId);
    const {email, displayName, providerId} = user;

    const username = email.split("@")[0];

    // store in database
    const res = await axios.post(`${siteConfig.BASE_URL}api/users/google-login`, {
      firstName: displayName.split(" ")[0],
      lastName: displayName.split(" ")[1],
      username: username,
      email: email,
      role: "user",
      provider: providerId
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return res.data;
    }
    
    
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    alert(error.response.data.message);
    return null;
  }
}

export { app, auth, googleProvider, signInWithGoogle }

