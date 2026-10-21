gunakan review metode CODE untuk readme agar rapi

*Aplikasi dashboard monitoring kendaraan yang dibuat untuk kebutuhan Technical Test Frontend Developer TransJakarta*

Aplikasi menggunakan data kendaraan dari API MBTA V3 untuk menampilkan informasi kendaraan, rute, perjalanan, dan lokasi kendaraan pada peta.

Teknologi
-React Js
-Vite untuk Development dan build
-Tailwind CSS
-Axios – HTTP request
-React Leaflet
-Lucide React – Icon

Fitur
-Menampilkan daftar kendaraan dan statusnya
-Filter berdasarkan Route dan Trip
-Multi-select filter dengan infinite scroll
-Pagination daftar kendaraan
-Popup detail informasi kendaraan
-Peta lokasi kendaraan
-Loading indicator saat mengambil data
-Refresh data dan penanganan error

Cara Menjalankan
1. Clone repository
git clone https://github.com/USERNAME/transjakarta-fleet.git
cd transjakarta-fleet
2. Install dependencies
npm install
3. Jalankan aplikasi
npm run dev
4. Build aplikasi
npm run build

Arsitektur Aplikasi dengan memisahkan halaman, komponen UI, dan layanan API.

src/
├── components/
│   ├── VehicleCard.jsx
│   ├── VehicleDetail.jsx
│   ├── VehicleFilter.jsx
│   ├── VehicleMap.jsx
│   └── Pagination.jsx
├── pages/
│   └── Dashboard.jsx
└── services/
    └── api.js

Alur ambil data:
MBTA API → API Service → React State → UI Components

Sumber Data : MBTA V3 API: https://api-v3.mbta.com
