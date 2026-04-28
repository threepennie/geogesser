import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInAnonymously,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import L from "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/+esm";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let map;
let guessMarker = null;
let answerMarker = null;
let selectedGuess = null;
let streetViewPanorama = null;
let currentLocation = null;
let totalScore = 0;
let round = 0;
let bestScore = null;

const WORLD_LOCATIONS = [
  { lat: 35.6586, lng: 139.7454, label: "Tokyo" },
  { lat: 48.8584, lng: 2.2945, label: "Paris" },
  { lat: -33.8568, lng: 151.2153, label: "Sydney" },
  { lat: 40.6892, lng: -74.0445, label: "New York" },
  { lat: -22.9519, lng: -43.2105, label: "Rio" },
  { lat: 51.5007, lng: -0.1246, label: "London" },
  { lat: 30.3285, lng: 35.4444, label: "Petra" }
];

const authStatus = document.getElementById("authStatus");
const roundNum = document.getElementById("roundNum");
const totalScoreEl = document.getElementById("totalScore");
const bestScoreEl = document.getElementById("bestScore");
const resultEl = document.getElementById("result");

function initMap() {
  map = L.map("guessMap", { worldCopyJump: true }).setView([20, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  map.on("click", (e) => {
    selectedGuess = e.latlng;
    if (guessMarker) guessMarker.remove();
    guessMarker = L.marker(selectedGuess).addTo(map);
  });
}

window.initStreetView = function initStreetView() {
  if (streetViewPanorama) return;
  streetViewPanorama = new google.maps.StreetViewPanorama(document.getElementById("streetView"), {
    position: { lat: 35.6586, lng: 139.7454 },
    pov: { heading: 220, pitch: 5 },
    zoom: 1,
    addressControl: false,
    showRoadLabels: false
  });
};

function randomLocation() {
  const index = Math.floor(Math.random() * WORLD_LOCATIONS.length);
  return WORLD_LOCATIONS[index];
}

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function scoreByDistance(distanceKm) {
  const score = Math.max(0, Math.round(5000 * Math.exp(-distanceKm / 2200)));
  return score;
}

async function startRound() {
  if (!streetViewPanorama) {
    resultEl.textContent = "Google Maps APIの読み込み後に開始できます。";
    return;
  }

  currentLocation = randomLocation();
  round += 1;
  roundNum.textContent = String(round);
  resultEl.textContent = "マップをクリックして推測地点を置いてください。";

  if (answerMarker) {
    answerMarker.remove();
    answerMarker = null;
  }

  streetViewPanorama.setPosition({ lat: currentLocation.lat, lng: currentLocation.lng });
  streetViewPanorama.setPov({ heading: Math.random() * 360, pitch: 0 });
}

async function submitGuess() {
  if (!currentLocation) {
    resultEl.textContent = "先に新しいラウンドを開始してください。";
    return;
  }
  if (!selectedGuess) {
    resultEl.textContent = "地図上をクリックして推測地点を選んでください。";
    return;
  }

  const answer = { lat: currentLocation.lat, lng: currentLocation.lng };
  const distanceKm = haversineKm(selectedGuess, answer);
  const gained = scoreByDistance(distanceKm);
  totalScore += gained;

  answerMarker = L.marker([answer.lat, answer.lng]).addTo(map);
  totalScoreEl.textContent = String(totalScore);
  resultEl.textContent = `正解地点: ${currentLocation.label} / 距離: ${distanceKm.toFixed(1)} km / 獲得: ${gained}`;

  const user = auth.currentUser;
  if (user && !user.isAnonymous) {
    if (bestScore === null || totalScore > bestScore) {
      bestScore = totalScore;
      bestScoreEl.textContent = String(bestScore);
      await setDoc(doc(db, "scores", user.uid), {
        uid: user.uid,
        displayName: user.displayName || "No Name",
        bestScore,
        updatedAt: new Date().toISOString()
      });
    }
  }
}

async function loadBestScore(user) {
  if (!user || user.isAnonymous) {
    bestScore = null;
    bestScoreEl.textContent = "ゲストは保存なし";
    return;
  }
  const snap = await getDoc(doc(db, "scores", user.uid));
  if (snap.exists()) {
    bestScore = snap.data().bestScore;
    bestScoreEl.textContent = String(bestScore);
  } else {
    bestScore = 0;
    bestScoreEl.textContent = "0";
  }
}

document.getElementById("guestBtn").addEventListener("click", async () => {
  await signInAnonymously(auth);
});

document.getElementById("googleBtn").addEventListener("click", async () => {
  await signInWithPopup(auth, new GoogleAuthProvider());
});

document.getElementById("facebookBtn").addEventListener("click", async () => {
  await signInWithPopup(auth, new FacebookAuthProvider());
});

document.getElementById("twitterBtn").addEventListener("click", async () => {
  await signInWithPopup(auth, new TwitterAuthProvider());
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  totalScore = 0;
  round = 0;
  totalScoreEl.textContent = "0";
  roundNum.textContent = "0";
});

document.getElementById("newRoundBtn").addEventListener("click", startRound);
document.getElementById("submitBtn").addEventListener("click", submitGuess);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    authStatus.textContent = "未ログイン";
    bestScoreEl.textContent = "-";
    return;
  }

  if (user.isAnonymous) {
    authStatus.textContent = "ゲストモード";
  } else {
    authStatus.textContent = `ログイン中: ${user.displayName || user.email || user.uid}`;
  }

  await loadBestScore(user);
});

initMap();
