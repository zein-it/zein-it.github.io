document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll('.slides img');
    const skillItems = document.querySelectorAll('.keahlian_sertifikat ul li');
    const slideContainer = document.querySelector('.slide-container');
    let currentIndex = 0;
    let scrollInterval;
    let isManualChange = false;

    const scrollSpeed = 30; // Kecepatan scroll (ms)
    const delayBeforeScroll = 800; // Waktu jeda sebelum scroll dimulai (ms)
    const delayAfterScroll = 800; // Waktu jeda setelah scroll selesai (ms)
    const autoSlideDelay = 800; // Jeda auto-slide setelah interaksi manual (ms)

    // Grup gambar yang terkait dengan setiap <li> item
    const skillImageGroups = {
        0: [0], // Working at Height
        1: [1, 2], // Cisco (mengelompokkan gambar ke-1 dan ke-2)
        2: [3], // Fortinet
        3: [4], // Mikrotik
        4: [5], // Data Science
        5: [6]  // SKKNI
    };

    // Fungsi scroll otomatis gambar
    function scrollImage() {
        slideContainer.scrollTop = 0;
        slides.forEach((img, index) => img.classList.toggle('active', index === currentIndex));
        
        // Aktifkan item <li> yang terkait dengan gambar saat ini
        skillItems.forEach((item, index) => {
            const relatedImages = skillImageGroups[index] || [];
            item.classList.toggle('active', relatedImages.includes(currentIndex));
        });

        // Jeda sebelum scroll dimulai
        setTimeout(() => {
            scrollInterval = setInterval(() => {
                if (slideContainer.scrollTop < slideContainer.scrollHeight - slideContainer.clientHeight) {
                    slideContainer.scrollTop += 1;
                } else {
                    clearInterval(scrollInterval);
                    setTimeout(() => {
                        if (!isManualChange) showNextSlide();
                        isManualChange = false;
                    }, delayAfterScroll);
                }
            }, scrollSpeed);
        }, delayBeforeScroll);
    }

    // Pindah ke slide berikutnya
    function showNextSlide() {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        scrollImage();
    }

    // Fungsi untuk reset slideshow saat item skill di-klik
    function resetSlideshowOnSkillClick(index) {
        clearInterval(scrollInterval);
        currentIndex = skillImageGroups[index][0] || 0; // Pindah ke gambar pertama di grup item yang dipilih
        isManualChange = true;
        scrollImage();
    }

    // Event listener untuk item skill
    skillItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            resetSlideshowOnSkillClick(index);
        });
    });

    // Memulai slideshow
    scrollImage();
});
