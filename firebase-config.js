 // ✅ Import Firebase
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
    import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

    // ✅ Firebase config (apna config paste karein)
    const firebaseConfig = {
      apiKey: "AIzaSyAm5Ylwg2h_BRifRY0vRanLwC6Eb_v_nno",
    authDomain: "ucdealer-e49fd.firebaseapp.com",
    projectId: "ucdealer-e49fd",
    storageBucket: "ucdealer-e49fd.firebasestorage.app",
    messagingSenderId: "795869297198",
    appId: "1:795869297198:web:f3887da1a55a17e9cdfdbf",
    measurementId: "G-CWL0SBEHGY"
    };

    // ✅ Initialize Firebase + Firestore
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);