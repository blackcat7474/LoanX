import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// --- IMPORTANT ---
// Replace this with your own Firebase project configuration.
// You can get this from the Firebase Console:
// Project Settings > General > Your apps > Web app > SDK setup and configuration
const firebaseConfig = {
  projectId: "studio-3367357133-c4d78",
  appId: "1:861442308778:web:bec73ef7771b38f03f2ed3",
  apiKey: "AIzaSyDLTd-bZekB6FUqwVNUwETYlI06JSwsgvM",
  authDomain: "studio-3367357133-c4d78.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "861442308778"
};

let db: any;
let firebaseError: string | null = null;

// Check if the config has been filled out
if (firebaseConfig.apiKey.startsWith("AIzaSyXXX")) {
    firebaseError = "Your Firebase configuration is missing. Please update 'services/firebase.ts' with your project credentials from the Firebase Console to connect to the database.";
} else {
    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    } catch (e: any) {
        console.error("Firebase initialization failed:", e);
        firebaseError = `Firebase initialization failed: ${e.message}. Please check your configuration in 'services/firebase.ts'.`;
    }
}

export { db, firebaseError };
