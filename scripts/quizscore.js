// scripts/quizscore.js
import { db, auth } from "./firebase.js";
import {
  doc, getDoc, setDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

export async function saveQuizScore(quizId, score) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const uid = user.uid;
  const name = user.displayName || user.email.split("@")[0];

  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  const userData = userDoc.exists() ? userDoc.data() : {};
  const scores = userData.scores || {};
  scores[quizId] = score;

  await setDoc(userRef, {
    name,
    scores
  }, { merge: true });

  console.log("✅ Score saved to Firestore");
}
