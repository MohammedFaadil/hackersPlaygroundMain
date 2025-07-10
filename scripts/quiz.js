// scripts/quiz.js
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Quiz Questions


const db = getFirestore();
let currentQuestionIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let timer;

// Load a question
function loadQuestion() {
  clearInterval(timer);
  const q = quizData[currentQuestionIndex];
  document.getElementById("question").innerText = `Question ${currentQuestionIndex + 1}: ${q.question}`;
  document.getElementById("question").style.opacity = 1;

  const optionsEl = document.getElementById("options");
  optionsEl.innerHTML = "";

  q.options.forEach(option => {
    const li = document.createElement("li");
    li.innerText = option;
    li.onclick = () => selectOption(option);
    optionsEl.appendChild(li);
  });

  document.getElementById("result").innerText = "";
  document.getElementById("nextBtn").style.display = "none";
  startTimer(10);
  updateProgress();
}

// Timer
function startTimer(seconds) {
  let timeLeft = seconds;
  document.getElementById("time").innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      document.getElementById("result").innerText = "Time's up! You missed the question.";
      incorrectAnswers++;
      document.getElementById("nextBtn").style.display = "block";
    }
  }, 1000);
}

// Option Selection
function selectOption(selected) {
  clearInterval(timer);
  const q = quizData[currentQuestionIndex];

  if (selected === q.answer) {
    correctAnswers++;
    document.getElementById("result").innerText = "✅ Correct!";
  } else {
    incorrectAnswers++;
    document.getElementById("result").innerText = `❌ Wrong! Correct: ${q.answer}`;
  }

  document.getElementById("nextBtn").style.display = "block";
}

// Next Question
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    showFinalScore();
  }
}

// Progress Bar
function updateProgress() {
  const progressBar = document.getElementById("progressBar");
  const percent = ((currentQuestionIndex + 1) / quizData.length) * 100;
  progressBar.style.width = percent + "%";
}

// ✅ Save to Firestore in 'users' collection with scores object
async function saveQuizScore(quizId, score, user) {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    email: user.email,
    name: user.displayName || user.email.split("@")[0],
    scores: {
      [quizId]: score
    }
  }, { merge: true });
}

// Show Final Result
async function showFinalScore() {
  document.getElementById("question").style.display = "none";
  document.getElementById("options").style.display = "none";
  document.getElementById("nextBtn").style.display = "none";
  document.querySelector(".timer").style.display = "none";
  document.querySelector(".progress-container").style.display = "none";

  document.getElementById("finalScore").style.display = "block";
  document.getElementById("finalScoreResult").innerText = `${correctAnswers}/${quizData.length}`;
  document.getElementById("correctCount").innerText = correctAnswers;
  document.getElementById("incorrectCount").innerText = incorrectAnswers;

  const quizId = window.location.pathname.split("/").pop().replace(".html", ""); // auto-detect quiz ID
  const score = correctAnswers;
  const user = auth.currentUser;

  if (!user) {
    alert("User not logged in. Cannot save score.");
    return;
  }

  try {
    await saveQuizScore(quizId, score, user);
    console.log("✅ Score saved");
  } catch (err) {
    console.error("❌ Error saving score:", err);
  }
}

// Auth Check
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Logged in as:", user.email);
    loadQuestion();
  } else {
    console.log("❌ Not logged in.");
    alert("Please log in to access the quiz.");
    window.location.href = "/signin.html";
  }
});

// Next Button
document.getElementById("nextBtn").onclick = nextQuestion;
