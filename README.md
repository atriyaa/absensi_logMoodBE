# LogMood Backend API

Backend API untuk aplikasi absensi dan monitoring mood karyawan (LogMood). Dibangun menggunakan **Node.js, Express, TypeScript, dan Drizzle ORM** dengan database MySQL.

## 📂 Struktur Direktori

```text
src/
├── controllers/       # Logika bisnis dan penanganan request/response API
├── db/                # Konfigurasi database, skema Drizzle ORM, dan seeders
├── middlewares/       # Middleware Express (Autentikasi JWT, Error Handler, dll)
├── routes/            # Definisi endpoint (routing) untuk setiap fitur
└── index.ts           # Titik masuk utama (Entry point) aplikasi Express
```

## 🔐 Autentikasi
Sebagian besar endpoint memerlukan token JWT. Token harus dikirimkan di header `Authorization` dengan format:
`Authorization: Bearer <TOKEN_JWT>`

---

## 📡 Dokumentasi Endpoint API

### 1. Auth (`/auth`)
*   **POST** `/auth/login`
    *   **Payload:** `{ "email": "user@example.com", "password": "password123" }`
    *   **Response:** `{ "success": true, "message": "Login berhasil", "token": "..." }`
*   **POST** `/auth/register`
    *   **Payload:** `{ "full_name": "John Doe", "name": "John", "email": "john@example.com", "password": "..." }`
    *   **Response:** `{ "success": true, "message": "Aktivasi akun/Register berhasil! Silakan login." }`
*   **PUT** `/auth/update-profile` *(Memerlukan Token)*
    *   **Payload:** `{ "name": "John Baru" }`
    *   **Response:** `{ "success": true, "message": "Nama berhasil diperbarui" }`
*   **PUT** `/auth/change-password` *(Memerlukan Token)*
    *   **Payload:** `{ "oldPassword": "...", "newPassword": "..." }`
    *   **Response:** `{ "success": true, "message": "Password berhasil diubah" }`

### 2. Employees (`/employees`) *(Memerlukan Token untuk sebagian besar akses)*
*   **GET** `/employees` - Mengambil semua data karyawan beserta role & department.
*   **GET** `/employees/:id` - Mengambil detail karyawan berdasarkan ID.
*   **POST** `/employees` - Membuat data karyawan baru (hanya dilakukan Admin via Form Data).
    *   **Payload (FormData):** `employee_code`, `full_name`, `no_phone`, `department_id`, `role_id`, `work_schedule_id`
*   **PUT** `/employees/:id` - Mengupdate data karyawan (via Form Data).
*   **DELETE** `/employees/:id` - Menghapus karyawan.

### 3. Departments (`/departments`)
*   **GET** `/departments` - Mengambil seluruh data divisi/departemen.
*   **POST** `/departments` - Membuat departemen baru.
    *   **Payload:** `{ "departmentsName": "IT", "description": "..." }`
*   **PUT** `/departments/:id` - Mengupdate departemen.
*   **DELETE** `/departments/:id` - Menghapus departemen.

### 4. Work Schedules (`/workSchedules`)
*   **GET** `/workSchedules` - Mengambil daftar jadwal kerja.
*   **GET** `/workSchedules/:id` - Detail jadwal kerja.
*   **POST** `/workSchedules` - Membuat jadwal kerja.
    *   **Payload:** `{ "scheduleName": "Reguler", "startTime": "08:00", "endTime": "17:00", "toleranceMinutes": 15 }`
*   **PUT** `/workSchedules/:id` - Mengupdate jadwal kerja.
*   **DELETE** `/workSchedules/:id` - Menghapus jadwal kerja.

### 5. Roles (`/roles`)
*   **GET** `/roles` - Mengambil daftar role (misal: Admin, Karyawan).
*   **POST** `/roles`
    *   **Payload:** `{ "role_name": "Admin" }`
*   **PUT** `/roles/:id`
*   **DELETE** `/roles/:id`

### 6. Attendance Logs (`/attedanceLogs`)
*   **GET** `/attedanceLogs` - Mendapatkan seluruh histori absensi (Admin).
*   **GET** `/attedanceLogs/my-history` *(Memerlukan Token)* - Mendapatkan histori absensi karyawan yang login.
*   **POST** `/attedanceLogs/check-in` *(Memerlukan Token)*
    *   **Payload:** `{ "photo_in": "data:image/jpeg;base64,..." }`
    *   **Response:** `{ "success": true, "message": "Check-in berhasil" }`
*   **PUT** `/attedanceLogs/check-out` *(Memerlukan Token)*
    *   **Payload:** Kosong (Hanya memerlukan token JWT)
    *   **Response:** `{ "success": true, "message": "Check-out berhasil" }`
*   **GET** `/attedanceLogs/report-monthly` - Mengunduh laporan bulanan karyawan ke format `.xlsx`.
*   **GET** `/attedanceLogs/report-monthly-departments` - Mengunduh laporan bulanan departemen ke format `.xlsx`.

### 7. Mood Journals (`/moodJournals`)
*   **GET** `/moodJournals` *(Memerlukan Token)* - Mengambil seluruh data mood jurnal (Admin).
*   **GET** `/moodJournals/my-journals` *(Memerlukan Token)* - Mengambil riwayat mood karyawan yang login.
*   **POST** `/moodJournals` *(Memerlukan Token)*
    *   **Payload:** `{ "moodLevel": "Excited", "note": "Hari ini sangat menyenangkan" }`
    *   **Response:** `{ "success": true, "message": "Jurnal mood berhasil disimpan" }`
*   **PUT** `/moodJournals/:id` *(Memerlukan Token)* - Memperbarui catatan mood.
*   **DELETE** `/moodJournals/:id` *(Memerlukan Token)* - Menghapus catatan mood.
*   **GET** `/moodJournals/mood-monthly` - Mengunduh rekapan data mood bulanan dalam format `.xlsx`.

### 8. Dashboard (`/admin`)
*   **GET** `/admin/dashboard` - Mengambil rangkuman statistik untuk dashboard Admin.
    *   **Response:** `{ "success": true, "data": { "totalEmployees": 10, "attendanceToday": { "present": 5, "late": 1, "absent": 4 }, "moodTrends": [...] } }`

---
*Dibuat untuk melengkapi dokumentasi tugas UAS pengembangan aplikasi web.*