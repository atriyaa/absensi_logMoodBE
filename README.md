# AbsensiLogMood

## Deskripsi Proyek

AbsensiLogMood adalah aplikasi sistem absensi karyawan yang dikembangkan untuk mencatat kehadiran sekaligus merekam kondisi suasana hati karyawan pda saat melakukan absensi. Aplikasi ini menyediakan fitur selfie sebagai bukti kehadiran, serta fitur pencatatan mood dan catatan yang dapat diisi oleh karyawan.

Data mood dan catatan yang dikumpulkan dapat digunakan untuk melakukan rekapitulasi kondisi karyawan secara berkala. Dengan demikian, sistem ini tidak hanya berfungsi sebagai media pencatatan kehadiran, tetapi juga sebagai serana untuk memperoleh informasi tambahan mengenai kondisi dan pengalaman karyawan di lingkungan kerja.

## Masalah yang Diselesaikan

Sistem absensi pada umumnya hanya berfokus pada pencatatan waktu kehadiran
karyawan, seperti waktu masuk dan waktu pulang. Sistem tersebut belum
menyediakan cara untuk mengetahui kondisi atau suasana hati karyawan ketika
melakukan absensi.

Akibatnya, perusahaan tidak memiliki data tambahan yang dapat memberikan
gambaran mengenai kondisi karyawan secara berkala. Oleh karena itu,
AbsensiLogMood dikembangkan untuk mengintegrasikan pencatatan kehadiran
dengan fitur selfie, pencatatan mood, dan catatan karyawan.

Melalui sistem ini, perusahaan dapat memperoleh data absensi yang lebih
lengkap serta melakukan rekapitulasi mood karyawan untuk membantu memahami
kondisi lingkungan kerja dan perkembangan suasana hati karyawan dari waktu
ke waktu.

## Anggota Kelompok

| No |    Nama Anggota    |         Peran       | Pembagian Tugas Konkret |
| 1  | Anisa Triyana      | Backend Developer   | Merancang database, membuat REST API, mengembangkan autentikasi pengguna, mengelola datakaryawan, membuat fitur absensi check-in dan check-out, mengelola data selfie dan lokasi absensi, serta membuat fitur mood, catatan, dan rekapitulasi data |
| 2  | Ahmad Farizi       | Fron tend Developer | Merancang dan membuat antarmuka aplikasi, mengembangkan halaman login dan register, halaman data karyawan, halaman absensi, fitur selfie, input mood dan catatan, serta halaman rekapitulasi mood karyawan |

## Dokumentasi Skema Database

Database yang digunakan dalam aplikasi AbsensiLogMood terdiri dari beberapa tabel yang saling berelasi untuk menyimpan data karyawan, data absensi, serta informasi mood dan catatan karyawan. 

## Daftar Table

--Tabel Roles--
id int
role_name varchar(100)
description varchar(255)

--Table moodJournal--
id int
employeeId int
attedanceLogId int
moodLevel enum('Excited', 'Happy', 'Neutral', 'Tired', 'Stressed')
note text
createdAt timestamp

-- Table attedanceLogs--
id int
employeeId int
attedanceDate date
checkIn timestamp
checkOut timestamp 
latitudeIn decimal
latitudeOut decimal 
longitudeIn decimal
longitudeOut decimal
workingHours decimal
photoIn longtext
attedanceStatus enum('present', 'late', 'absent')
createdAt timestamp

--Table Departments--
id int
departmentsName varchar
description varchar 

--Table Employees--
id int
employee_code varchar
full_name varchar
name varchar
email varchar
password varchar
no_phone varchar 
photo varchar 
department_id int
role_id int
workScheduleId int
status enum("Active","Inactive","Resigned",)
created_at timestamp
updated_at timestamp

--Table workSchedule--
id int
scheduleName varchar
startTime time
endTime time
toleranceMinutes int
createdAt timestamp

## Relasi Table
Table Roles 
Roles(1) ------- Employees(N)
Table Departments
Departments(1) ------Employees(N)
Table WorkSchedule 
Workschedule(1) ------- Employess(N)
Table Employees
memiliki relasi ke table employyees
Table AttedanceLogs 
ini merupakan table absensi dari setiap karyawan, setiap karyawan maksimal memiliki satu data absensi
