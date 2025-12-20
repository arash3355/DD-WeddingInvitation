import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

(function () {
  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("to");

  const guestNameEl = document.getElementById("guest-name");

  if (guestName && guestNameEl) {
    guestNameEl.textContent = decodeURIComponent(guestName.replace(/\+/g, " "));
  }


  document.addEventListener("DOMContentLoaded", () => {

    /* ===================== BACKGROUND MUSIC ===================== */
    const music = document.getElementById("bg-music");
    const musicBtn = document.getElementById("musicBtn");

    if (music && musicBtn) {
      music.volume = 0.5;

      const muted = localStorage.getItem("musicMuted") === "yes";
      music.muted = muted;
      musicBtn.textContent = muted ? "🔇" : "🔊";

      if (localStorage.getItem("playMusic") === "yes") {
        setTimeout(() => music.play().catch(() => { }), 500);
      }

      musicBtn.addEventListener("click", () => {
        music.muted = !music.muted;
        localStorage.setItem("musicMuted", music.muted ? "yes" : "no");
        musicBtn.textContent = music.muted ? "🔇" : "🔊";
      });
    }

    /* ===================== EVENT DATE & COUNTDOWN ===================== */
    const eventDateEl = document.getElementById("event-date-text");
    const timerEl = document.getElementById("countdown-timer");

    const eventDate = eventDateEl
      ? new Date(eventDateEl.dataset.eventDate)
      : null;

    function updateCountdown() {
      if (!eventDate || !timerEl) return;

      const diff = eventDate - new Date();
      if (diff <= 0) {
        timerEl.textContent = "Hari ini 🎉";
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);

      timerEl.textContent = `${d} hari ${h} jam ${m} menit ${s} detik`;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* ===================== RSVP TOGGLE ===================== */
    const rsvpSection = document.getElementById("rsvp");
    const openBtn = document.getElementById("open-rsvp");
    const closeBtn = document.getElementById("close-rsvp");

    if (rsvpSection) rsvpSection.style.display = "none";

    openBtn?.addEventListener("click", () => {
      rsvpSection.style.display = "block";
      rsvpSection.scrollIntoView({ behavior: "smooth" });
    });

    closeBtn?.addEventListener("click", () => {
      rsvpSection.style.display = "none";
    });

    /* ===================== FIRESTORE RSVP ===================== */
    const form = document.getElementById("rsvp-form");
    const guestItems = document.getElementById("guest-items");
    const rsvpRef = collection(window.db, "rsvps");

    function escapeHtml(str) {
      return String(str).replace(/[&<>"]/g, s =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[s])
      );
    }

    function listenGuests() {
      const q = query(
        rsvpRef,
        orderBy("createdAt", "desc"),
        limit(20)
      );

      onSnapshot(q, snap => {
        guestItems.innerHTML = "";

        if (snap.empty) {
          guestItems.innerHTML = "<li>Belum ada pesan.</li>";
          return;
        }

        snap.forEach(doc => {
          const g = doc.data();
          const li = document.createElement("li");

          li.className = "chat-bubble";

          li.innerHTML = `
        <div class="chat-name">${escapeHtml(g.name)}</div>
        <div class="chat-message">
          ${escapeHtml(g.message || "—")}
        </div>
        <div class="chat-meta">
          ${escapeHtml(g.attend)} • ${g.count} orang
        </div>
      `;

          guestItems.appendChild(li);
        });

        // auto scroll ke pesan terbaru
        guestItems.scrollTop = guestItems.scrollHeight;
      });
    }



    form?.addEventListener("submit", async e => {
      e.preventDefault();

      const data = {
        name: form["guest-name"].value.trim(),
        contact: form["guest-contact"].value.trim(),
        attend: form["guest-attend"].value,
        count: Number(form["guest-count"].value),
        message: form["guest-message"].value.trim(),
        createdAt: serverTimestamp()
      };

      if (!data.name || !data.contact) {
        alert("Nama & kontak wajib diisi");
        return;
      }

      try {
        await addDoc(rsvpRef, data);
        alert("Terima kasih! 🤍");
        form.reset();
        rsvpSection.style.display = "none";
      } catch (err) {
        console.error(err);
        alert("Gagal mengirim RSVP");
      }
    });

    listenGuests();

    /* ===================== SCROLL ANIMATION ===================== */
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        e.target.classList.toggle("show", e.isIntersecting);
      });
    }, { threshold: 0.2 });

    document.querySelectorAll(".animate").forEach(el => observer.observe(el));

    /* ===================== FLOATING BUTTON ===================== */
    const fab = document.querySelector(".fab-container");
    const fabMain = document.querySelector(".fab-main");
    fabMain?.addEventListener("click", () => fab.classList.toggle("active"));

  });
})();
