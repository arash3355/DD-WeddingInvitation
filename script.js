(function () {
  // === BACKGROUND MUSIC (SAFE VERSION) ===
  document.addEventListener('DOMContentLoaded', function () {

    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('musicBtn');

    if (!music || !musicBtn) return;

    music.volume = 0.5;

    // restore mute state
    const muted = localStorage.getItem('musicMuted') === 'yes';
    music.muted = muted;
    musicBtn.textContent = muted ? '🔇' : '🔊';

    // autoplay after open invitation
    if (localStorage.getItem('playMusic') === 'yes') {
      setTimeout(() => {
        music.play().catch(() => { });
      }, 500);
    }

    musicBtn.addEventListener('click', function () {
      music.muted = !music.muted;
      localStorage.setItem('musicMuted', music.muted ? 'yes' : 'no');
      musicBtn.textContent = music.muted ? '🔇' : '🔊';
    });

  });



  /* ===================== EVENT DATE (1 SUMBER) ===================== */
  const eventDateEl = document.getElementById("event-date-text");
  const eventDate = eventDateEl
    ? new Date(eventDateEl.dataset.eventDate)
    : null;

  /* ===================== COUNTDOWN ===================== */
  const timerEl = document.getElementById("countdown-timer");

  function updateCountdown() {
    if (!eventDate || !timerEl) return;

    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
      timerEl.textContent = "Hari ini 🎉";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    timerEl.textContent =
      `${days} hari ${hours} jam ${minutes} menit ${seconds} detik`;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ===================== SAVE THE DATE ===================== */
  const saveBtn = document.getElementById("saveDateBtn");

  if (saveBtn && eventDate) {
    saveBtn.addEventListener("click", () => {
      const start = eventDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const endDate = new Date(eventDate.getTime() + 5 * 60 * 60 * 1000);
      const end = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

      const url =
        "https://www.google.com/calendar/render?action=TEMPLATE" +
        "&text=The+Wedding+of+Dimitrios+%26+Eirene" +
        "&dates=" + start + "/" + end +
        "&details=Akad+dan+Resepsi+Pernikahan" +
        "&location=Gedung+Terbengkalai";

      window.open(url, "_blank");
    });
  }

  /* ===================== NAMA TAMU DARI URL ===================== */
  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("to");
  const guestInput = document.getElementById("guest-name");

  if (guestName && guestInput) {
    guestInput.value = guestName;
  }

  /* ===================== RSVP TOGGLE ===================== */
  const rsvpSection = document.getElementById("rsvp");
  const openRsvpBtn = document.getElementById("open-rsvp");
  const closeRsvpBtn = document.getElementById("close-rsvp");

  if (rsvpSection) rsvpSection.style.display = "none";

  if (openRsvpBtn && rsvpSection) {
    openRsvpBtn.addEventListener("click", () => {
      rsvpSection.style.display = "block";
      rsvpSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (closeRsvpBtn && rsvpSection) {
    closeRsvpBtn.addEventListener("click", () => {
      rsvpSection.style.display = "none";
    });
  }

  /* ===================== RSVP STORAGE ===================== */
  const form = document.getElementById("rsvp-form");
  const guestItems = document.getElementById("guest-items");
  const clearBtn = document.getElementById("clear-guestlist");
  const storageKey = "wedding_guestlist_v1";

  function loadGuests() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  }

  function saveGuests(list) {
    localStorage.setItem(storageKey, JSON.stringify(list));
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
  }

  function renderGuests() {
    if (!guestItems) return;

    const list = loadGuests();
    guestItems.innerHTML = "";

    if (list.length === 0) {
      guestItems.innerHTML = "<li>Belum ada konfirmasi.</li>";
      return;
    }

    list.forEach(g => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${escapeHtml(g.name)}</strong> — ${escapeHtml(g.attend)} (${g.count})<br>
        <small>${escapeHtml(g.contact)}</small><br>
        <em>${escapeHtml(g.message || "")}</em>
      `;
      guestItems.appendChild(li);
    });
  }

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const data = {
        name: form["guest-name"].value.trim(),
        contact: form["guest-contact"].value.trim(),
        attend: form["guest-attend"].value,
        count: form["guest-count"].value,
        message: form["guest-message"].value.trim(),
        time: new Date().toISOString()
      };

      if (!data.name || !data.contact) {
        alert("Mohon isi nama dan kontak.");
        return;
      }

      const list = loadGuests();
      list.push(data);
      saveGuests(list);
      renderGuests();

      alert("Terima kasih! Konfirmasi tersimpan.");
      form.reset();
      rsvpSection.style.display = "none";
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Hapus semua data RSVP?")) {
        localStorage.removeItem(storageKey);
        renderGuests();
      }
    });
  }

  renderGuests();

  // === SCROLL ANIMATION ===
  const animatedElements = document.querySelectorAll('.animate');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  animatedElements.forEach(el => observer.observe(el));

  // === COPY REKENING ===
  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Nomor rekening berhasil disalin");
    });
  }


  // === FLOATING BUTTON TOGGLE ===
  const fab = document.querySelector('.fab-container');
  const fabMain = document.querySelector('.fab-main');

  fabMain.addEventListener('click', () => {
    fab.classList.toggle('active');
  });



})();
