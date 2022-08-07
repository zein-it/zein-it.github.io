var warna_ubah = document.body; // 1. membuat variabel agar dapat melakukan aksi ke bagian body

function ubahWarna() {
    warna_ubah.classList.toggle("gelap"); // 2. akan merubah class di bagian dalam dari tag body, menambahkan/menghilangkan class gelap >> html
    if (warna_ubah.classList.contains('gelap')) { // 4. melakukan pengecekan apakah di bagian body no 1 punya class yang bernama 'gelap'
        localStorage.setItem('tema', 'gelap'); // 5. memasukkan pengaturan/nilai ke dalam lokal storage/browser
    } else {
        localStorage.setItem('tema', 'terang') // 5. Key = tema / Value = terang
    }
}

var tema = localStorage.getItem("tema"); // 3. menampung nilai dari 'gelap' ke dalam var tema
if (tema=='gelap') { // 6. cek apakah lokal storage/browser memiliki nilai tema = gelap
    warna_ubah.classList.add("gelap"); // 6. memberikan nilai warna_ubah menjadi gelap > kembali ke no 2
}