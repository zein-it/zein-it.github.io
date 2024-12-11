if (navigator.webdriver) {
    alert('Browser otomatis terdeteksi!');
    window.location.href = 'warning.html';
}

(function () {
    const threshold = 160; // Batas minimum untuk deteksi DevTools
    let devToolsDetected = false; // Menandai apakah DevTools sudah terdeteksi
    let resizeTimeout; // Menyimpan ID dari setTimeout untuk debounce
    let consistentCheckCount = 0; // Menghitung berapa kali deteksi berturut-turut menemukan DevTools

    // Fungsi utama untuk mendeteksi DevTools
    function detectDevTools() {
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;

        if (widthDiff > threshold || heightDiff > threshold) {
            consistentCheckCount++; // Tambahkan jumlah deteksi konsisten
        } else {
            consistentCheckCount = 0; // Reset deteksi jika DevTools ditutup
        }

        // Jika DevTools terdeteksi selama 3 kali berturut-turut (selama 1,5 detik), ambil tindakan
        if (consistentCheckCount >= 3) {
            if (!devToolsDetected) {
                devToolsDetected = true; // Tandai DevTools telah terdeteksi
                alert('Alat pengembang terdeteksi!\n\nKonten dilindungi hak cipta © Zein-IT');
                window.location.href = 'warning.html'; // Redirect ke halaman peringatan
            }
        }
    }

    // Fungsi debounce saat pengguna resize jendela browser
    function handleResizeEvent() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(detectDevTools, 200); // Tunggu 200ms setelah resize selesai
    }

    // Deteksi saat halaman pertama kali dimuat
    window.addEventListener('DOMContentLoaded', detectDevTools);

    // Deteksi melalui resize event
    window.addEventListener('resize', handleResizeEvent);

    // Deteksi secara berkala untuk mengatasi kelicikan pengguna
    setInterval(detectDevTools, 500); // Periksa setiap 500ms untuk berjaga-jaga jika pengguna mengakali resize

    // Observer untuk mendeteksi perubahan DOM (MutationObserver)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            detectDevTools();
        });
    });

    // Targetkan body, memeriksa semua perubahan ukuran
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
})();