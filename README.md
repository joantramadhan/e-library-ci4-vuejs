# UAS_WEB2_312410300_JOANT_RAMADHAN

# 📚 E-LIBRARY MANAGEMENT SYSTEM

<div align="center">

### 📖 Sistem Perpustakaan Digital Berbasis REST API

**Ujian Akhir Semester - Pemrograman Web 2**

---

![PHP](https://img.shields.io/badge/PHP-8.2-blue?style=for-the-badge\&logo=php)
![CodeIgniter](https://img.shields.io/badge/CodeIgniter-4-red?style=for-the-badge\&logo=codeigniter)
![Vue](https://img.shields.io/badge/Vue.js-3-green?style=for-the-badge\&logo=vue.js)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange?style=for-the-badge\&logo=mysql)
![Axios](https://img.shields.io/badge/Axios-HTTP-purple?style=for-the-badge)

</div>

---

## 👨‍🎓 Profil Mahasiswa

| Keterangan  | Informasi         |
| ----------- | ----------------- |
| Nama        | Joant Ramadhan    |
| NIM         | 312410594         |
| Kelas       | I241D             |
| Mata Kuliah | Pemrograman Web 2 |

---

## 📖 Latar Belakang Proyek

Perkembangan teknologi informasi mendorong transformasi sistem perpustakaan dari metode konvensional menuju sistem digital yang lebih efisien. Pengelolaan data buku secara manual sering menimbulkan kendala dalam proses pencarian, penyimpanan, maupun pembaruan informasi.

E-Library dikembangkan sebagai aplikasi perpustakaan digital berbasis web yang memungkinkan administrator mengelola koleksi buku secara terpusat melalui antarmuka yang modern dan terintegrasi dengan REST API.

---

## 🎯 Tujuan Pengembangan

Aplikasi ini dibuat untuk:

* Mengelola data buku secara digital.
* Mempermudah proses pencarian informasi buku.
* Mengelola kategori buku secara terstruktur.
* Mengelola akun pengguna sistem.
* Mengimplementasikan konsep REST API menggunakan CodeIgniter 4.
* Mengimplementasikan Single Page Application menggunakan Vue.js.

---

## 🏛️ Arsitektur Sistem

Sistem menggunakan pendekatan Frontend dan Backend yang dipisahkan.

```text
Vue.js SPA
     │
     │ HTTP Request (Axios)
     ▼
CodeIgniter 4 REST API
     │
     ▼
MySQL Database
```

Dengan pendekatan ini, frontend dan backend dapat dikembangkan secara independen sehingga lebih mudah dipelihara dan dikembangkan di masa mendatang.

---

## 🛠️ Teknologi yang Digunakan

### Backend

* PHP 8.2
* CodeIgniter 4
* RESTful API
* Authentication Token
* MySQL

### Frontend

* Vue.js 3
* Vue Router
* Axios
* Tailwind CSS

### Tools Pendukung

* XAMPP
* phpMyAdmin
* Visual Studio Code
* Git & GitHub

---

## ✨ Fitur Sistem

### Login dan Keamanan

* Login administrator
* Validasi akun pengguna
* Token Authentication
* Logout

### Dashboard

* Menampilkan ringkasan data sistem
* Statistik jumlah buku
* Statistik kategori
* Statistik pengguna

### Pengelolaan Buku

* Menambahkan data buku
* Mengubah data buku
* Menghapus data buku
* Upload cover buku
* Menampilkan detail buku
* Pencarian buku

### Pengelolaan Kategori

* Menambah kategori
* Mengubah kategori
* Menghapus kategori
* Menampilkan daftar kategori

### Pengelolaan User

* Menambah akun pengguna
* Mengubah data pengguna
* Menghapus pengguna
* Menampilkan daftar pengguna

### Antarmuka Pengguna

* Responsive Design
* Dark Mode
* Modern Dashboard
* Single Page Application

---

## 🗄️ Struktur Data

### Users

Menyimpan informasi akun administrator yang dapat mengakses sistem.

### Kategori

Digunakan untuk mengelompokkan buku berdasarkan jenis atau topik tertentu.

### Buku

Menyimpan seluruh informasi koleksi buku seperti judul, penulis, penerbit, tahun terbit, deskripsi, dan cover buku.

---

## 📡 Layanan API

### Authentication

```http
POST /api/login
```

### Dashboard

```http
GET /api/dashboard
```

### Buku

```http
GET /api/buku
POST /api/buku
PUT /api/buku/{id}
DELETE /api/buku/{id}
```

### Kategori

```http
GET /api/kategori
POST /api/kategori
PUT /api/kategori/{id}
DELETE /api/kategori/{id}
```

### User

```http
GET /api/user
POST /api/user
PUT /api/user/{id}
DELETE /api/user/{id}
```

---

## 🚀 Cara Menjalankan Sistem

### Backend

```bash
php spark serve
```

### Frontend

Buka file SPA melalui web server lokal dan pastikan backend API telah aktif.

---

## 📷 Dokumentasi

* Halaman Login
* Dashboard
* Data Buku
* Data Kategori
* Data User
* Dark Mode
* Detail Buku

https://youtu.be/WghzT7DsYx0?si=uyLhVXKOa0_CtSks

---

## 📈 Hasil Implementasi

Seluruh fitur utama berhasil diimplementasikan dan diuji, meliputi:

* REST API berjalan normal
* Login berbasis token berfungsi
* CRUD Buku berjalan dengan baik
* CRUD Kategori berjalan dengan baik
* CRUD User berjalan dengan baik
* Upload cover buku berhasil
* Vue Router berfungsi
* Integrasi Axios dengan API berhasil
* Dark Mode berjalan dengan baik

---

## 📝 Kesimpulan

Proyek E-Library berhasil dibangun menggunakan kombinasi CodeIgniter 4 dan Vue.js dengan pendekatan REST API. Sistem mampu mengelola data perpustakaan secara digital melalui fitur autentikasi, pengelolaan buku, kategori, dan pengguna.

Selain memenuhi kebutuhan pengelolaan data perpustakaan, proyek ini juga menjadi implementasi nyata konsep Full Stack Web Development yang mencakup backend, frontend, database, autentikasi, dan integrasi API dalam satu sistem yang terintegrasi.
