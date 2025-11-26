/* =========================================
   1. GLOBAL STATE & NAVBAR LOGIC
   ========================================= */
let slideInterval; // Untuk Modal Proker
let slideIndexHero = -1; // Mulai dari -1 agar hitungan pertama (++) jadi 0

// Data untuk Typewriter
const textToType = "Komunikasi & Informasi";
const typingElement = document.getElementById("typewriter");
let typeIndex = 0;
let isDeleting = false;

/* =========================================
   2. FUNCTION DEFINITIONS
   ========================================= */

// Helper function to load the image source from data-src
function loadSlideImage(slide) {
  if (slide.dataset.src && !slide.src) {
    slide.src = slide.dataset.src;
    // slide.removeAttribute('data-src'); // Biarkan atribut data-src tetap ada jika nanti ingin di-reset
  }
}

// --- BARU: Hero Image Parallax / Tilt ---
function setupHeroImageTilt() {
  const heroSection = document.getElementById("home"); // Ambil seluruh hero section
  const heroImage = document.getElementById("heroImage"); // Ambil gambar di hero section

  if (!heroSection || !heroImage) return;

  // Kekuatan efek tilt (semakin kecil, semakin lembut pergerakannya)
  const tiltStrength = 0.05;

  heroSection.addEventListener("mousemove", (e) => {
    // Posisi mouse relatif terhadap hero section
    const rect = heroSection.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Posisi tengah hero section
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Hitung perbedaan posisi mouse dari tengah
    const diffX = mouseX - centerX;
    const diffY = mouseY - centerY;

    // Hitung nilai transform (rotateX dan rotateY)
    const rotateY = diffX * tiltStrength * -1; // Invers X untuk rotasi Y
    const rotateX = diffY * tiltStrength; // Rotasi X normal

    // Aplikasikan transform pada gambar
    heroImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    heroImage.style.transition = `transform 0.1s ease-out`; // Animasi halus saat mouse bergerak
  });

  // Reset transform saat mouse meninggalkan area hero section
  heroSection.addEventListener("mouseleave", () => {
    heroImage.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    heroImage.style.transition = `transform 0.5s ease-out`; // Animasi reset yang lebih lambat
  });
}

// --- BARU: Setup 3D Tilt Cards ---
function setup3DTiltCards() {
  // Pilih semua elemen yang akan diberi efek tilt
  const tiltElements = document.querySelectorAll(
    ".proker-card, .struct-card, .gallery-item"
  );

  if (tiltElements.length === 0) return;

  const tiltStrength = 15; // Kekuatan tilt (derajat maksimal rotasi)
  const perspective = 1000; // Jarak perspektif 3D

  tiltElements.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Rotasi X: Semakin ke bawah mouse, semakin memiringkan kartu ke depan
      // Rotasi Y: Semakin ke kanan mouse, semakin memiringkan kartu ke kiri
      const rotateX = ((mouseY - centerY) / centerY) * tiltStrength * -1;
      const rotateY = ((mouseX - centerX) / centerX) * tiltStrength;

      card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`;
    });
  });
}

// --- 2.1 Typewriter Effect (KODE ASLI) ---
function typeEffect() {
  if (!typingElement) return;

  const currentText = textToType.substring(0, typeIndex);
  typingElement.textContent = currentText;

  let typeSpeed = 100 - Math.random() * 50;

  if (isDeleting) {
    typeSpeed = 40;
    typeIndex--;
  } else {
    typeIndex++;
  }

  if (!isDeleting && typeIndex === textToType.length + 1) {
    isDeleting = true;
    typeSpeed = 3000;
  } else if (isDeleting && typeIndex === 0) {
    isDeleting = false;
    typeSpeed = 1000;
  }

  setTimeout(typeEffect, typeSpeed);
}

// --- 2.2 Hero Auto-Slideshow (GESER) ---

function carousel() {
  let slides = document.getElementsByClassName("heroSlides");
  const slideDuration = 5000;

  if (slides.length === 0) {
    setTimeout(carousel, 500);
    return;
  }

  // 1. Sembunyikan semua slide
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.opacity = 0;
    slides[i].style.display = "none";
  }

  // 2. Hitung index berikutnya
  slideIndexHero++;
  if (slideIndexHero > slides.length) {
    slideIndexHero = 1; // Kembali ke slide pertama
  }

  // 3. Tampilkan slide yang aktif
  slides[slideIndexHero - 1].style.display = "block";
  slides[slideIndexHero - 1].style.opacity = 1; /* Efek fade in */

  setTimeout(carousel, slideDuration);
}

// --- 2.3 Modal Slideshow (PROKER) ---
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
  let modal = document.getElementById(modalId);
  let slides = modal.getElementsByClassName("mySlides");

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  if (slides.length > 0) {
    let firstSlide = slides[0];
    loadSlideImage(firstSlide); // Load image for the first slide
    firstSlide.style.display = "block";
  }

  startSlideshow(modalId);
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  clearInterval(slideInterval);
}

function plusSlides(n, modalId) {
  let slides = document
    .getElementById(modalId)
    .getElementsByClassName("mySlides");
  let visibleIndex = -1;

  for (let i = 0; i < slides.length; i++) {
    if (slides[i].style.display === "block") {
      visibleIndex = i;
      break;
    }
  }
  if (visibleIndex > -1) slides[visibleIndex].style.display = "none";

  let nextIndex = visibleIndex + n;
  if (nextIndex >= slides.length) nextIndex = 0;
  if (nextIndex < 0) nextIndex = slides.length - 1;

  let nextSlide = slides[nextIndex];
  loadSlideImage(nextSlide); // Load image for the next slide
  nextSlide.style.display = "block";

  startSlideshow(modalId);
}

function startSlideshow(modalId) {
  clearInterval(slideInterval);
  slideInterval = setInterval(function () {
    plusSlides(1, modalId);
  }, 3000);
}

// --- 2.4 Modal Team (STRUKTUR) ---
function openTeamModal(imgSrc, name, role) {
  const modal = document.getElementById("modalTeam");

  // Periksa apakah foto struktur sudah dimuat
  let teamImg = document.getElementById("teamImg");
  if (teamImg.src !== imgSrc) {
    teamImg.src = imgSrc;
  }

  document.getElementById("teamName").innerText = name;
  document.getElementById("teamRole").innerText = role;
  modal.style.display = "block";
}

function closeTeamModal() {
  document.getElementById("modalTeam").style.display = "none";
}

// --- 2.5 Load More Gallery ---
function setupLoadMore() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const galleryItems = document.querySelectorAll(".gallery-grid .gallery-item");
  let currentItems = 10;

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", (e) => {
      let nextItems = currentItems + 10;
      for (let i = currentItems; i < nextItems; i++) {
        if (galleryItems[i]) {
          galleryItems[i].style.display = "block";
        }
      }
      currentItems = nextItems;
      if (currentItems >= galleryItems.length) {
        e.target.style.display = "none";
      }
    });
  }
}

/* =========================================
   3. INIT & EVENT HANDLERS
   ========================================= */
document.addEventListener("DOMContentLoaded", function () {
  // A. Init Nav & Hamburger
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
    document.querySelectorAll(".nav-links li a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }

  // B. Init Features
  typeEffect();
  carousel();
  setupLoadMore();

  // Panggil fungsi-fungsi TILT BARU di sini
  setupHeroImageTilt();
  setup3DTiltCards();
});

// C. Back to Top Listener
const toTop = document.querySelector(".to-top");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
});

// D. Unified Window Click Handler (for modals)
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
    if (typeof slideInterval !== "undefined") clearInterval(slideInterval);
  }
};
/* =========================================
   HANDLE CONTACT FORM (AJAX)
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".main-contact-form"); // Sesuaikan class form Anda
  const modal = document.getElementById("successModal");
  const btnSubmit = form.querySelector(".btn-submit-form");
  const originalBtnText = btnSubmit.innerHTML;

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault(); // 1. Mencegah halaman reload/pindah

      // Ubah tombol jadi loading
      btnSubmit.innerHTML =
        "Mengirim... <i class='fas fa-spinner fa-spin'></i>";
      btnSubmit.disabled = true;

      const data = new FormData(event.target);

      try {
        // 2. Kirim data ke Formspree menggunakan Fetch API
        const response = await fetch(event.target.action, {
          method: form.method,
          body: data,
          headers: {
            Accept: "application/json",
          },
        });

        // 3. Jika berhasil
        if (response.ok) {
          modal.classList.add("active"); // Munculkan Pop-up
          form.reset(); // Kosongkan form
        } else {
          // Jika ada error dari Formspree
          alert(
            "Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi."
          );
        }
      } catch (error) {
        // Jika error koneksi
        alert("Terjadi kesalahan koneksi.");
      } finally {
        // Kembalikan tombol seperti semula
        btnSubmit.innerHTML = originalBtnText;
        btnSubmit.disabled = false;
      }
    });
  }
});

// Fungsi Tutup Modal
function closeSuccessModal() {
  const modal = document.getElementById("successModal");
  modal.classList.remove("active");
}

// Tutup modal jika klik di luar area putih
window.addEventListener("click", function (event) {
  const modal = document.getElementById("successModal");
  if (event.target === modal) {
    modal.classList.remove("active");
  }
});
