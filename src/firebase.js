import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCMckbbGCK_TMqBaHIc9k4oRhbSVFMAlIA",
  authDomain: "my-store-db-833e9.firebaseapp.com",
  databaseURL: "https://my-store-db-833e9-default-rtdb.firebaseio.com",
  projectId: "my-store-db-833e9",
  storageBucket: "my-store-db-833e9.firebasestorage.app",
  messagingSenderId: "424177569028",
  appId: "1:424177569028:web:3a9b64fb892f5882ce5451"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);