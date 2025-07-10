// scripts/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBt7je8Ga9fKVJ7Pu2Ok8HvbFaLV5Qe1ts",
  authDomain: "hackersplayground-ca1a1.firebaseapp.com",
  projectId: "hackersplayground-ca1a1",
  storageBucket: "hackersplayground-ca1a1.firebasestorage.app",
  messagingSenderId: "597874916220",
  appId: "1:597874916220:web:85ad84575aac58ce4c82f9",
  measurementId: "G-PSC705VYNS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
