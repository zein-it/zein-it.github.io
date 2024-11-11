document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll('.slides img');
    const skillItems = document.querySelectorAll('.keahlian_sertifikat ul li');
    const slideContainer = document.querySelector('.slide-container');
    let currentIndex = 0;
    let scrollInterval;
    const scrollSpeed = 30; // Kecepatan scroll (ms)
    const delayBeforeScroll = 800; // Waktu jeda sebelum scroll dimulai (ms)
    const delayAfterScroll = 800; // Waktu jeda setelah scroll selesai (ms)

    // Fungsi scroll otomatis gambar
    function scrollImage() {
        slideContainer.scrollTop = 0; // Reset posisi scroll ke atas
        slides.forEach((img, index) => img.classList.toggle('active', index === currentIndex));
        skillItems.forEach((item, index) => item.classList.toggle('active', index === currentIndex)); // Tandai item aktif

        // Jeda sebelum scroll dimulai
        setTimeout(() => {
            scrollInterval = setInterval(() => {
                if (slideContainer.scrollTop < slideContainer.scrollHeight - slideContainer.clientHeight) {
                    slideContainer.scrollTop += 1; // Scroll ke bawah
                } else {
                    clearInterval(scrollInterval);
                    setTimeout(showNextSlide, delayAfterScroll); // Jeda sebelum pindah slide
                }
            }, scrollSpeed);
        }, delayBeforeScroll);
    }

    // Pindah ke slide berikutnya
    function showNextSlide() {
        slides[currentIndex].classList.remove('active');
        skillItems[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length; // Loop kembali ke slide pertama
        scrollImage();
    }

    // Fungsi untuk reset slideshow ketika salah satu skill diklik
    function resetSlideshowOnSkillClick(index) {
        clearInterval(scrollInterval); // Hentikan scroll otomatis
        currentIndex = index; // Update indeks ke yang diklik
        scrollImage(); // Mulai ulang dengan gambar baru
    }

    // Event listener untuk item skill untuk mengganti slide manual
    skillItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            resetSlideshowOnSkillClick(index);
        });
    });

    // Mulai slideshow
    scrollImage();
});
