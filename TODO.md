# TODO Backend Penyesuaian Guest/Admin

- [x] Update `app/Config/Routes.php` agar:
  - [ ] `GET /api/buku` & `GET /api/buku/{id}` tanpa token (guest)
  - [ ] `POST/PUT/DELETE /api/buku` tetap wajib token (admin)
  - [ ] `CRUD /api/kategori` & `CRUD /api/user` tetap wajib token (admin)
  - [ ] `GET /api/dashboard` tetap wajib token (admin)
- [x] (Setelah edit) Verifikasi route & cara test via Postman/curl

