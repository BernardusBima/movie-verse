# 🎬 MovieVerse - Aplikasi Penemuan Film

Selamat datang di MovieVerse, sebuah aplikasi web responsif yang dirancang untuk menjelajahi dunia perfilman. Dibangun dari nol menggunakan Vanilla JavaScript dan ditenagai oleh The Movie Database (TMDB) API, aplikasi ini memungkinkan pengguna untuk menemukan film populer, mencari judul tertentu, dan menyimpan daftar favorit mereka.

![MovieVerse Screenshot](https://raw.githubusercontent.com/BernardusBima/movie-verse/main/images/Screenshot-Project.png)

**🔗 Live Demo:** [Link ke GitHub Pages-mu akan ada di sini]

---

## ✨ Fitur Unggulan

-   **Interaksi dengan API Eksternal:** Mengambil dan menampilkan data film secara dinamis dari TMDB API.
-   **Pencarian Real-Time:** Cari film apa pun berdasarkan judul dan dapatkan hasilnya secara instan.
-   **Pagination:** Jelajahi lebih banyak film dengan tombol "Load More" yang memuat halaman data berikutnya.
-   **Sistem Favorit:** Simpan film favoritmu! Data disimpan secara permanen di browser menggunakan `localStorage`.
-   **Detail Film:** Klik pada poster mana pun untuk melihat detail lengkap seperti sinopsis, rating, dan tanggal rilis dalam sebuah modal yang interaktif.
-   **UI Modern & Responsif:** Tampilan gelap yang terinspirasi dari layanan streaming, dirancang agar terlihat bagus di desktop maupun perangkat mobile.

## 🛠️ Teknologi yang Digunakan

-   **HTML5**
-   **CSS3** (Flexbox, Grid, Variabel, Media Queries)
-   **Vanilla JavaScript (ES6+)**
    -   `async/await` untuk menangani permintaan Asynchronous.
    -   `Fetch API` untuk berkomunikasi dengan TMDB API.
    -   `localStorage` untuk manajemen data di sisi klien.
-   **The Movie Database (TMDB) API** sebagai sumber data.
-   **Font Awesome** untuk ikonografi.

## 🚀 Cara Menjalankan

1.  **Clone repository ini:**
    ```bash
    git clone [https://github.com/NAMA_USERNAMEMU/movie-discovery-app.git](https://github.com/NAMA_USERNAMEMU/movie-discovery-app.git)
    ```
2.  **Masuk ke folder proyek:**
    ```bash
    cd movie-discovery-app
    ```
3.  **Dapatkan API Key:**
    -   Daftar di [The Movie Database (TMDB)](https://www.themoviedb.org/).
    -   Dapatkan API Key (v3 auth) dari pengaturan akunmu.
4.  **Masukkan API Key:**
    -   Buka file `script.js`.
    -   Ganti placeholder `'MASUKKAN_API_KEY_KAMU_DI_SINI'` dengan API Key yang kamu dapatkan.
5.  **Buka `index.html`** di browser.

## 🧑‍💻 Author

-   **Bernardus Bima**
