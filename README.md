# Arusku 💸

**Plan • Track • Manage Keuanganmu**

Arusku adalah aplikasi manajemen keuangan pribadi berbasis web yang dirancang untuk membantu pengguna **merencanakan, mencatat, dan mengelola arus keuangan** dengan mudah.  
Dibangun dengan **Laravel 11**, **Vue 3**, **Inertia.js**, dan **Tailwind CSS** untuk pengalaman seperti mobile app.

---

## 🚀 Fitur Utama

- **PLAN** — Buat dan kelola rencana keuangan.
- **TRACK** — Catat pemasukan dan pengeluaran.
- **MANAGE** — Atur budget dan kategori pengeluaran.
- **Dashboard** — Ringkasan saldo, grafik arus uang, dan laporan.
- **Responsive UI** — Tampilan mobile-first dengan bottom navigation.
- **PWA Ready** — Bisa di-install seperti aplikasi mobile.

---

## 🛠️ Tech Stack

- **Backend**: [Laravel 11](https://laravel.com/)
- **Frontend**: [Vue 3](https://vuejs.org/) + [Inertia.js](https://inertiajs.com/)
- **UI Framework**: [Tailwind CSS](https://tailwindcss.com/)
- **Auth**: Laravel Breeze
- **Database**: MySQL / PostgreSQL / SQLite
- **Chart**: Chart.js / Recharts (opsional)

---

## 📦 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/bodrooo/arusku.git
cd arusku
```

### 2. Install Dependencies

```bash
composer install
npm install
```

### 3. Konfigurasi Environment

```bash
cp .env.example .env
php artisan key:generate
```

Sesuaikan pengaturan database di `.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=arusku
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Migrasi Database

```bash
php artisan migrate
```

### 5. Jalankan Development Server

```bash
npm run dev
php artisan serve
```

Buka `http://127.0.0.1:8000`

---

## 📂 Struktur Folder Penting

```
database/migrations   # Skema database
resources/js/Pages    # Halaman Vue
resources/js/Layouts  # Layout Vue + Inertia
resources/css         # Styling Tailwind
routes/web.php        # Route Laravel
```

---

## 🧩 Rencana Pengembangan

- [ ] Fitur kategori transaksi custom
- [ ] Laporan PDF/Excel
- [ ] Sinkronisasi multi-device
- [ ] Integrasi notifikasi pengingat

---

## 📜 Lisensi

Proyek ini dirilis di bawah lisensi [MIT](LICENSE).

---

Dibuat dengan ❤️ oleh Bodro Adikoro
