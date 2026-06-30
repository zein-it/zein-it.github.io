// Ambil elemen toggle
const toggleCheckbox = document.getElementById('toggle-mode');

// Event ketika toggle diklik
toggleCheckbox.addEventListener('change', () => {
    if (toggleCheckbox.checked) {
        document.body.classList.add('gelap');
        localStorage.setItem('tema', 'gelap');
    } else {
        document.body.classList.remove('gelap');
        localStorage.setItem('tema', 'terang');
    }
});

// Cek status tema dari localStorage atau aktifkan mode gelap secara default
document.addEventListener('DOMContentLoaded', () => {
    const tema = localStorage.getItem('tema');

    if (tema === 'gelap' || tema === null) { // Mode gelap aktif jika tidak ada preferensi sebelumnya
        document.body.classList.add('gelap');
        toggleCheckbox.checked = true;
        if (tema === null) {
            localStorage.setItem('tema', 'gelap'); // Simpan mode gelap sebagai default
        }
    } else if (tema === 'terang') {
        document.body.classList.remove('gelap');
        toggleCheckbox.checked = false;
    }
});