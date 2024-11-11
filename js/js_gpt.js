document.addEventListener("DOMContentLoaded", function() {
    // Pilih semua gambar dan simpan sebagai array
    const images = document.querySelectorAll('.slides img');
    let currentIndex = 0; // indeks gambar aktif saat ini

    // Fungsi untuk beralih ke gambar berikutnya
    function slideNextImage() {
        // Hilangkan kelas 'active' dari gambar saat ini
        images[currentIndex].classList.remove('active');
        
        // Perbarui indeks untuk gambar berikutnya
        currentIndex = (currentIndex + 1) % images.length;
        
        // Tambahkan kelas 'active' ke gambar berikutnya
        images[currentIndex].classList.add('active');
    }

    // Fungsi untuk menjalankan otomatis pergantian gambar
    function startAutoScroll() {
        setInterval(slideNextImage, 9000); // Waktu antar gambar (3000 ms = 3 detik)
    }

    // Mulai auto scroll ketika halaman dimuat
    startAutoScroll();
});
