// Firebase project configuration.
//
// SETUP (one-time):
// 1. Go to https://console.firebase.google.com/ and create a free project.
// 2. In the project, click the "</>" (web) icon to register a web app.
// 3. Firebase shows you a firebaseConfig object - copy its values into the object below.
//    These values are NOT secret; they identify your project to Firebase's client
//    SDK. Access to your data is controlled by the security rules you set in the
//    Firebase console (Authentication + Firestore), not by hiding this config.
// 4. In the Firebase console, enable Authentication -> Sign-in method -> Email/Password.
// 5. In the Firebase console, create a Firestore database (Build -> Firestore Database
//    -> Create database, start in production mode) and set rules so only signed-in
//    users can write, e.g.:
//
//      rules_version = '2';
//      service cloud.firestore {
//        match /databases/{database}/documents {
//          match /bookings/{id} { allow create: if true; allow read, update, delete: if false; }
//          match /messages/{id} { allow create: if true; allow read, update, delete: if false; }
//        }
//      }
//
//    (This lets the public website submit bookings/messages, but only you can read
//    them - via the Firebase console - since no client is allowed to read/list them.)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT.firebaseapp.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
