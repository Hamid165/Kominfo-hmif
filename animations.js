/* =========================================
   SCROLL ANIMATION (REPEATABLE / BERULANG)
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const options = {
    root: null,
    threshold: 0.1, // Animasi jalan saat 10% elemen terlihat
    rootMargin: "0px", // Margin normal
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // KAALAU MASUK LAYAR: Tambah class 'active' -> Animasi Muncul
        entry.target.classList.add("active");
      } else {
        // KALAU KELUAR LAYAR: Hapus class 'active' -> Reset ke awal (Hilang)
        // Ini kuncinya supaya bisa animasi ulang saat di-scroll lagi
        entry.target.classList.remove("active");
      }
    });
  }, options);

  // Cari semua elemen yang punya class 'reveal'
  const elementsToAnimate = document.querySelectorAll(".reveal");

  // Pasang observer ke setiap elemen tersebut
  elementsToAnimate.forEach((el) => {
    observer.observe(el);
  });
});
