import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpKut3zaqhpDXu-ls_9g32zhTh7aVLjSc",
  authDomain: "gym-site-a51f5.firebaseapp.com",
  projectId: "gym-site-a51f5",
  storageBucket: "gym-site-a51f5.firebasestorage.app",
  messagingSenderId: "796333327788",
  appId: "1:796333327788:web:5e49d3dff0bf2ec65be609",
  measurementId: "G-PMVYT70RYV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
