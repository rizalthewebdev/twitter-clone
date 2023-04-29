import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
   apiKey: "AIzaSyBkrmuiL7LyclPCc6KBh7PMXToesx2u0Xo",
   authDomain: "twitter-clone-b81d2.firebaseapp.com",
   projectId: "twitter-clone-b81d2",
   storageBucket: "twitter-clone-b81d2.appspot.com",
   messagingSenderId: "752914583118",
   appId: "1:752914583118:web:d457a47f805452a5d1fd1f",
   measurementId: "G-N8F6TT1JQ7",
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
