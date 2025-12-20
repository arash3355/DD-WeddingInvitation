import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAlyRV-WmLzZ-1kuBECEhqXtfQPPOzJOJU",
    authDomain: "rsvp-a6fdf.firebaseapp.com",
    projectId: "rsvp-a6fdf",
    storageBucket: "rsvp-a6fdf.appspot.com",
    messagingSenderId: "882896034818",
    appId: "1:882896034818:web:bd28eb28b913d240e65b1b"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// 🔑 INI YANG DIPAKAI SCRIPT LAIN
window.db = getFirestore(app);
