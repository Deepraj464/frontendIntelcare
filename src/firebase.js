import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword, GoogleAuthProvider,FacebookAuthProvider, signInWithPopup,signOut} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDJbuqokI3GNZaDE3A8ptWjCcbwNcewtsM",
    authDomain: "intelcaredashboard.firebaseapp.com",
    projectId: "intelcaredashboard",
    storageBucket: "intelcaredashboard.firebasestorage.app",
    messagingSenderId: "812085753268",
    appId: "1:812085753268:web:e65d724e6b6e93cf986ee1",
    measurementId: "G-CZDVK48GY2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider,facebookProvider, signInWithEmailAndPassword,createUserWithEmailAndPassword,signInWithPopup,signOut};
