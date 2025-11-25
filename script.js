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

// --- 2.1 Typewriter Effect ---
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
